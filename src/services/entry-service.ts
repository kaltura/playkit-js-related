import { EntryListResponse } from "types/entry-list-response";

class EntryService {
  _player: KalturaPlayerTypes.Player;

  constructor(player: KalturaPlayerTypes.Player) {
    this._player = player;
  }

  async getEntriesByPlaylistId(playlistId: string) {
    const response: EntryListResponse =
      await this._player.provider.getPlaylistConfig({ playlistId });
    return processResponse(response);
  }

  async getEntriesByEntryIds(entryIds: string[]) {
    const entries = entryIds.map((entryId) => ({ entryId }));
    const response: EntryListResponse =
      await this._player.provider.getEntryListConfig({ entries });
    return processResponse(response);
  }
}

const processResponse = (response: EntryListResponse) => {
  return Promise.resolve(
    response.items.length
      ? response.items.map((entryData) => entryData.sources)
      : []
  );
};

export default EntryService;
