import EntryService from "services/entry-service";
import RelatedConfig from "types/config";

class RelatedManager {
  private player: KalturaPlayerTypes.Player;
  private config: RelatedConfig;
  private entries: KalturaPlayerTypes.Sources[] = [];
  private entryService: EntryService;

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
          next: { sources: this.entries[0] }
        }
      )
    );
  }

  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this.entries[lastPlayedIndex];
    this.entries.splice(lastPlayedIndex, 1);
    this.entries.push(lastPlayedEntry);
  }

  private async playByIndex(index: number) {
    this.player.loadMedia({ entryId: this.entries[index].id });
    this.cycleEntries(index);
    this.notifyNextItemChanged();
  }

  async load() {
    const { playlistId, entryList } = this.config;
    if (playlistId) {
      this.entries = await this.entryService.getEntriesByPlaylistId(playlistId);
    } else if (entryList?.length) {
      this.entries = await this.entryService.getEntriesByEntryIds(entryList);
    }
    this.notifyNextItemChanged();
    return Promise.resolve(this.entries);
  }

  playNext() {
    this.playByIndex(0);
  }

  playSelected(entryId: string) {
    this.playByIndex(this.entries.findIndex(({ id }) => id === entryId));
  }

  get showOnPlaybackDone() {
    return this.config.showOnPlaybackDone;
  }

  get showOnPlaybackPaused() {
    return this.config.showOnPlaybackPaused;
  }
}

export default RelatedManager;
