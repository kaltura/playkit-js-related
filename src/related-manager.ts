import {Related} from 'related';
import {EntryService} from 'services/entry-service';
import {RelatedConfig} from 'types/config';
import {RelatedEvent} from 'types/related-event';
import {Sources} from 'types/sources';
class RelatedManager extends KalturaPlayer.core.FakeEventTarget {
  private entryService: EntryService;

  private _entries: Sources[] = [];
  private config: RelatedConfig | null = null;
  private ks = '';
  private _isInitialized = false;
  private _isHiddenByUser = false;
  private plugin: Related;
  private mediaInfoMap: Map<string, KalturaPlayerTypes.MediaInfo> = new Map();

  constructor(plugin: Related) {
    super();
    this.plugin = plugin;

    this.playNext = this.playNext.bind(this);
    this.entryService = new EntryService(plugin.player, plugin.logger);
  }

  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);
    this.entries = [...this._entries, lastPlayedEntry];
  }

  private playByIndex(index: number) {
    this.isHiddenByUser = false;
    if (this.entryService.isPlayable(this.entries[index])) {
      this.plugin.player.setMedia({sources: this.entries[index]});
      this.plugin.player.play();
    } else {
      const entryId = this.entries[index].id;
      const mediaInfo = this.mediaInfoMap?.has(entryId) ? this.mediaInfoMap.get(entryId) : {entryId};

      this.plugin.player
        .loadMedia({...mediaInfo, ks: this.ks})
        .then(() => {
          this.logger.info('loadMedia success');
          this.plugin.player.play();
        })
        .catch(() => {
          this.logger.warning('loadMedia failed');
        });
    }
    this.cycleEntries(index);
  }

  async load(config: RelatedConfig, ks: string) {
    this.config = config;
    this.ks = ks;
    this.mediaInfoMap.clear();

    const {playlistId, entryList, sourcesList, useContext, entriesByContextLimit} = config;
    let entries: KalturaPlayerTypes.Sources[] = [];

    if (playlistId) {
      entries = await this.entryService.getByPlaylist({ks, playlistId});
    } else if (entryList?.length) {
      entries = await this.entryService.getByEntryList({entries: entryList, ks});
      entryList.forEach(mediaInfo => {
        if (typeof mediaInfo === 'object' && mediaInfo.entryId && entries.find(entry => entry.id === mediaInfo.entryId)) {
          this.mediaInfoMap.set(mediaInfo.entryId, mediaInfo);
        }
      });
    } else if (sourcesList?.length) {
      entries = this.entryService.getBySourcesList(sourcesList);
    } else if (useContext) {
      entries = await this.entryService.getByContext(this.plugin.player.sources.id, ks, entriesByContextLimit);
    } else {
      this.logger.warn('no source configured');
    }

    if (!entries.length) {
      this.logger.warn('no related entries found');
    }

    this.entries = entries;
    this._isInitialized = true;
  }

  startOver() {
    this.isHiddenByUser = false;
    this.plugin.player.play();
  }

  playNext() {
    this.logger.info('going to play next entry');
    this.playByIndex(0);
  }

  playSelected(internalIndex: number) {
    this.logger.info('going to play selected entry');
    this.playByIndex(internalIndex);
  }

  listen(name: string, listener: any) {
    this.plugin.eventManager.listen(this, name, listener);
  }

  unlisten(name: string, listener: any) {
    this.plugin.eventManager.unlisten(this, name, listener);
  }

  set isHiddenByUser(isHiddenByUser: boolean) {
    this._isHiddenByUser = isHiddenByUser;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.HIDDEN_STATE_CHANGED, isHiddenByUser));
  }

  get showOnPlaybackPaused(): boolean {
    return this.config?.showOnPlaybackPaused || false;
  }

  get countdownTime(): number {
    return this.config?.autoContinue && Number.isInteger(this.config?.autoContinueTime) ? this.config.autoContinueTime : -1;
  }

  set entries(entries: KalturaPlayerTypes.Sources[]) {
    this.logger.info(`related entries changed`);
    this._entries = entries.map((entry, index) => {
      return {
        ...entry,
        internalIndex: index
      };
    });
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_ENTRIES_CHANGED, this._entries));
  }

  get entries(): Sources[] {
    return this._entries;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get logger(): any {
    return this.plugin.logger;
  }
}

export {RelatedManager};
