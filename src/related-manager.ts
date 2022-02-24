import {EntryService} from 'services/entry-service';
import {RelatedConfig} from 'types/config';
import {RelatedEvent} from 'types/related-event';
import {Sources} from 'types/sources';

interface RelatedManagerProps {
  player: KalturaPlayerTypes.Player;
  eventManager: KalturaPlayerTypes.EventManager;
  dispatchEvent: (name: string, paylod: any) => void;
}
class RelatedManager {
  private player: KalturaPlayerTypes.Player;
  private eventManager: KalturaPlayerTypes.EventManager;
  private entryService: EntryService;
  private dispatchEvent: (name: string, payload: any) => void;
  private _entries: Sources[] = [];
  private _areEntriesExternal = false;
  private config: RelatedConfig | null = null;
  private ks = '';
  private _isInitialized = false;

  constructor(props: RelatedManagerProps) {
    this.player = props.player;
    this.eventManager = props.eventManager;
    this.entryService = new EntryService(props.player);
    this.dispatchEvent = props.dispatchEvent;

    this.playNext = this.playNext.bind(this);
  }

  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);
    this.setEntries([...this._entries, lastPlayedEntry]);
  }

  private playByIndex(index: number) {
    if (this._areEntriesExternal) {
      this.player.setMedia({sources: this.entries[index]});
      this.player.play();
    } else {
      const entry = this.entries[index];
      this.player.loadMedia({...entry, entryId: entry.id, ks: this.ks}).then(() => {
        this.player.play();
      });
    }
    this.cycleEntries(index);
  }

  async load(config: RelatedConfig, ks: string) {
    this.config = config;
    this.ks = ks;

    const {playlistId, entryList, externalEntryList, useContext, entriesByContextLimit} = config;
    let entries: KalturaPlayerTypes.Sources[] = [];

    if (playlistId) {
      this._areEntriesExternal = false;
      entries = await this.entryService.getByPlaylist({ks, playlistId});
    } else if (entryList?.length) {
      this._areEntriesExternal = false;
      entries = await this.entryService.getByEntryList({entries: entryList, ks});
    } else if (externalEntryList?.length) {
      this._areEntriesExternal = true;
      entries = this.entryService.getBySourcesList(externalEntryList);
    } else if (useContext) {
      this._areEntriesExternal = false;
      entries = await this.entryService.getByContext(this.player.sources.id, entriesByContextLimit);
    }

    this.setEntries(entries);
    this._isInitialized = true;
  }

  playNext() {
    this.playByIndex(0);
  }

  playSelected(internalIndex: number) {
    this.playByIndex(internalIndex);
  }

  listen(name: string, listener: any) {
    this.eventManager.listen(this.player, name, listener);
  }

  unlisten(name: string, listener: any) {
    this.eventManager.unlisten(this.player, name, listener);
  }

  get showOnPlaybackDone(): boolean {
    return this.config?.showOnPlaybackDone || false;
  }

  get showOnPlaybackPaused(): boolean {
    return this.config?.showOnPlaybackPaused || false;
  }

  get countdownTime(): number {
    return this.config?.autoContinue && Number.isInteger(this.config?.autoContinueTime) ? this.config.autoContinueTime : -1;
  }

  private setEntries(entries: KalturaPlayerTypes.Sources[]) {
    this._entries = entries.map((entry, index) => {
      return {
        ...entry,
        internalIndex: index
      };
    });
    this.dispatchEvent(RelatedEvent.RELATED_ENTRIES_CHANGED, this._entries);
  }

  get entries(): Sources[] {
    return this._entries;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }
}

export {RelatedManager};
