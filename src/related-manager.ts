import {EntryService} from 'services/entry-service';
import {RelatedConfig} from 'types/config';
import {RelatedEvent} from 'types/related-event';

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
  private _entries: KalturaPlayerTypes.Sources[] = [];
  private _areEntriesExternal = false;

  constructor(props: RelatedManagerProps) {
    this.player = props.player;
    this.eventManager = props.eventManager;
    this.config = props.config;
    this.entryService = new EntryService(props.player, props.config.entriesByContextLimit);
    this.dispatchEvent = props.dispatchEvent;

    this.playNext = this.playNext.bind(this);
  }

  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);
    this.entries = [...this._entries, lastPlayedEntry];
  }

  private async playByIndex(index: number) {
    if (this._areEntriesExternal) {
      this.player.setMedia({sources: this.entries[index]});
    } else {
      this.player.loadMedia({entryId: this.entries[index].id});
    }
    this.cycleEntries(index);
  }

  async load() {
    const {playlistId, entryList, sourcesList, useContext} = this.config;
    if (playlistId) {
      this._areEntriesExternal = false;
      this.entries = await this.entryService.getEntriesByPlaylistId(playlistId);
    } else if (entryList?.length) {
      this._areEntriesExternal = false;
      this.entries = await this.entryService.getEntriesByEntryIds(entryList);
    } else if (sourcesList?.length) {
      this._areEntriesExternal = true;
      this.entries = this.entryService.getEntriesByConfig(sourcesList);
    } else if (useContext) {
      this._areEntriesExternal = false;
      this.listen(this.player.Event.SOURCE_SELECTED, () => {
        this.entryService.getEntriesByContext(this.player.sources.id).then(entries => {
          this.entries = entries;
        });
      });
    }
  }

  playNext() {
    this.playByIndex(0);
  }

  playSelected(entryId: string) {
    this.playByIndex(this.entries.findIndex(({id}) => id === entryId));
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

  set entries(entries) {
    this._entries = entries;
    this.dispatchEvent(RelatedEvent.ENTRIES_CHANGED, entries);
  }

  get entries() {
    return this._entries;
  }

  get areEntriesExternal() {
    return this._areEntriesExternal;
  }
}

export {RelatedManager};
