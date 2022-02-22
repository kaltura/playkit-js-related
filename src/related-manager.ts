import {EntryService} from 'services/entry-service';
import {RelatedConfig} from 'types/config';
import {RelatedEvent} from 'types/related-event';
import {Sources} from 'types/sources';

interface RelatedManagerProps {
  player: KalturaPlayerTypes.Player;
  eventManager: KalturaPlayerTypes.EventManager;
  config: RelatedConfig;
  dispatchEvent: (name: string, paylod: any) => void;
}
class RelatedManager {
  private player: KalturaPlayerTypes.Player;
  private eventManager: KalturaPlayerTypes.EventManager;
  private config: RelatedConfig;
  private entryService: EntryService;
  private dispatchEvent: (name: string, payload: any) => void;
  private _entries: Sources[] = [];
  private _areEntriesExternal = false;

  constructor(props: RelatedManagerProps) {
    this.player = props.player;
    this.eventManager = props.eventManager;
    this.config = props.config;
    this.entryService = new EntryService(props.player);
    this.dispatchEvent = props.dispatchEvent;

    this.playNext = this.playNext.bind(this);
  }

  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);
    this.entries = [...this._entries, lastPlayedEntry];
  }

  private playByIndex(index: number) {
    if (this._areEntriesExternal) {
      this.player.setMedia({sources: this.entries[index]});
      this.player.play();
    } else {
      this.player.loadMedia({entryId: this.entries[index].id}).then(() => {
        this.player.play();
      });
    }
    this.cycleEntries(index);
  }

  async load() {
    const {playlist, entryList, externalEntryList, useContext} = this.config;
    if (playlist && playlist.playlistId) {
      this._areEntriesExternal = false;
      this.entries = await this.entryService.getByPlaylist(playlist);
    } else if (entryList && entryList.entries && entryList.entries.length) {
      this._areEntriesExternal = false;
      this.entries = await this.entryService.getByEntryList(entryList);
    } else if (externalEntryList && externalEntryList.length) {
      this._areEntriesExternal = true;
      this.entries = this.entryService.getBySourcesList(externalEntryList);
    } else if (useContext) {
      this._areEntriesExternal = false;
      this.listen(this.player.Event.SOURCE_SELECTED, () => {
        this.entryService.getByContext(this.player.sources.id, this.config.entriesByContextLimit).then(entries => {
          this.entries = entries;
        });
      });
    }
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

  get showOnPlaybackDone() {
    return this.config.showOnPlaybackDone;
  }

  get showOnPlaybackPaused() {
    return this.config.showOnPlaybackPaused;
  }

  get countdownTime() {
    return this.config.autoContinue && Number.isInteger(this.config.autoContinueTime) ? this.config.autoContinueTime : -1;
  }

  set entries(entries: KalturaPlayerTypes.Sources[]) {
    this._entries = entries.map((entry, index) => {
      return {
        ...entry,
        internalIndex: index
      };
    });
    this.dispatchEvent(RelatedEvent.ENTRIES_CHANGED, this._entries);
  }

  get entries(): Sources[] {
    return this._entries;
  }

  get areEntriesExternal() {
    return this._areEntriesExternal;
  }
}

export {RelatedManager};
