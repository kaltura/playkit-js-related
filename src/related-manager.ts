import EntryService from "services/entry-service";
import RelatedConfig from "types/config";

class RelatedManager {
  private player: KalturaPlayerTypes.Player;
  private config: RelatedConfig;
  private entryService: EntryService;
  private _entries: KalturaPlayerTypes.Sources[] = [];

  constructor(player: KalturaPlayerTypes.Player, config: RelatedConfig) {
    this.player = player;
    this.config = config;
    this.entryService = new EntryService(player);
    this.playNext = this.playNext.bind(this);
  }

  private notifyNextItemChanged() {
    this.player.dispatchEvent(
      new KalturaPlayer.core.FakeEvent(
        this.player.Event.Related.RELATED_ITEM_CHANGED,
        {
          playNext: this.playNext,
          next: { sources: this._entries[0] }
        }
      )
    );
  }

  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);
    this._entries.push(lastPlayedEntry);
  }

  private async playByIndex(index: number) {
    this.player.loadMedia({ entryId: this._entries[index].id });
    this.cycleEntries(index);
    this.notifyNextItemChanged();
  }

  async load() {
    const { playlistId, entryList } = this.config;
    if (playlistId) {
      this._entries = await this.entryService.getEntriesByPlaylistId(
        playlistId
      );
    } else if (entryList?.length) {
      this._entries = await this.entryService.getEntriesByEntryIds(entryList);
    }
    return Promise.resolve(this._entries.length);
  }

  init() {
    this.notifyNextItemChanged();
  }

  playNext() {
    this.playByIndex(0);
  }

  playSelected(entryId: string) {
    this.playByIndex(this._entries.findIndex(({ id }) => id === entryId));
  }

  get showOnPlaybackDone() {
    return this.config.showOnPlaybackDone;
  }

  get showOnPlaybackPaused() {
    return this.config.showOnPlaybackPaused;
  }

  get entries(): KalturaPlayerTypes.Sources[] {
    return this._entries;
  }
}

export default RelatedManager;
