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
  }

  async load() {
    const { playlistId, entryList } = this.config;
    if (playlistId) {
      this.entries = await this.entryService.getEntriesByPlaylistId(playlistId);
    } else if (entryList?.length) {
      this.entries = await this.entryService.getEntriesByEntryIds(entryList);
    }
    return Promise.resolve(this.entries);
  }

  play(entryId: string) {
    this.player.loadMedia({ entryId });
  }

  playNext() {
    // TODO
  }

  destroy() {
    // TODO
  }

  get showOnPlaybackDone() {
    return this.config.showOnPlaybackDone;
  }

  get showOnPlaybackPaused() {
    return this.config.showOnPlaybackPaused;
  }
}

export default RelatedManager;
