import {EntryService} from 'services';
import {RelatedConfig, RelatedEvent, Sources} from 'types';
class RelatedManager extends KalturaPlayer.core.FakeEventTarget {
  private player: KalturaPlayerTypes.Player;
  private logger: KalturaPlayerTypes.Logger;
  private eventManager: KalturaPlayerTypes.EventManager;

  private entryService: EntryService;

  private _entries: Sources[] = [];
  private config: RelatedConfig | null = null;
  private ks = '';
  private _isInitialized = false;
  private _isHiddenByUser = false;
  private mediaInfoMap: Map<string, KalturaPlayerTypes.MediaInfo> = new Map();
  private nextEntryTimeoutId = -1;
  private _isGridVisible = false;
  private _isListVisible = false;

  constructor({player, logger, eventManager}: KalturaPlayerTypes.BasePlugin) {
    super();

    this.playNext = this.playNext.bind(this);
    this.player = player;
    this.logger = logger;
    this.eventManager = eventManager;

    this.entryService = new EntryService(player, logger);
  }

  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);
    this.entries = [...this._entries, lastPlayedEntry];
  }

  private playByIndex(index: number) {
    this.clearNextEntryTimeout();
    this.isHiddenByUser = false;
    if (this.entryService.isPlayable(this.entries[index])) {
      this.player.setMedia({sources: this.entries[index]});
      this.player.play();
    } else {
      const entryId = this.entries[index].id;
      const mediaInfo = this.mediaInfoMap?.has(entryId) ? this.mediaInfoMap.get(entryId) : {entryId};

      this.player
        .loadMedia({...mediaInfo, ks: this.ks})
        .then(() => {
          this.logger.info('loadMedia success');
          this.player.play();
        })
        .catch(() => {
          this.logger.warn('loadMedia failed');
        });
    }
    this.cycleEntries(index);
  }

  async load(config: RelatedConfig, ks: string) {
    this.config = config;
    this.ks = ks;
    this.mediaInfoMap.clear();

    const {playlistId, entryList, sourcesList, useContext, entriesByContextLimit} = config;
    let entries: Sources[] = [];

    if (this.player.playlist?.items?.length) {
      // disable plugin if the player is in playlist playback mode
    } else if (playlistId) {
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
      entries = await this.entryService.getByContext(this.player.sources.id, ks, entriesByContextLimit);
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
    this.player.play();
  }

  playNext(seconds?: number) {
    this.logger.info('going to play next entry');

    if (seconds && seconds > 0) {
      this.clearNextEntryTimeout();
      this.nextEntryTimeoutId = window.setTimeout(() => {
        this.playByIndex(0);
      }, seconds * 1000);
    } else {
      this.playByIndex(0);
    }
  }

  playSelected(internalIndex: number) {
    this.logger.info('going to play selected entry');
    this.playByIndex(internalIndex);
  }

  clearNextEntryTimeout() {
    clearTimeout(this.nextEntryTimeoutId);
    this.nextEntryTimeoutId = -1;
  }

  listen(name: string, listener: any) {
    this.eventManager.listen(this, name, listener);
  }

  unlisten(name: string, listener: any) {
    this.eventManager.unlisten(this, name, listener);
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

  set entries(entries: Sources[]) {
    this.logger.info(`related entries changed`);
    this._entries = entries;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_ENTRIES_CHANGED, this._entries));
  }

  get entries(): Sources[] {
    return this._entries;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get isGridVisible(): boolean {
    return this._isGridVisible;
  }

  set isGridVisible(isGridVisible: boolean) {
    this._isGridVisible = isGridVisible;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.GRID_VISIBILITY_CHANGED, this._isGridVisible));
  }

  get isListVisible(): boolean {
    return this._isListVisible;
  }

  set isListVisible(isListVisible: boolean) {
    this._isListVisible = isListVisible;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.LIST_VISIBILITY_CHANGED, this._isListVisible));
  }
}

export {RelatedManager};
