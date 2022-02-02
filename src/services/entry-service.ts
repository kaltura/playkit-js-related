import {EntryListResponse} from 'types/entry-list-response';
import {RelatedLoader} from './related-loader';

class EntryService {
  _player: KalturaPlayerTypes.Player;

  constructor(player: KalturaPlayerTypes.Player) {
    this._player = player;
  }

  async getEntriesByPlaylistId(playlistId: string) {
    try {
      const response: EntryListResponse = await this._player.provider.getPlaylistConfig({playlistId});
      return processResponse(response);
    } catch (e) {
      return [];
    }
  }

  async getEntriesByEntryIds(entryIds: string[]) {
    const entries = entryIds.map(entryId => ({entryId}));

    if (entries.length) {
      try {
        const response: EntryListResponse = await this._player.provider.getEntryListConfig({entries});
        return processResponse(response);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  async getEntriesByContext(entryId: string) {
    try {
      const response = await this._player.provider.doRequest([{loader: RelatedLoader, params: {entryId}}]);
      return response.get('related').relatedEntries;
    } catch (e) {
      return [];
    }
  }
}

const processResponse = (response: EntryListResponse) => {
  return Promise.resolve(response.items.length ? response.items.map(entryData => entryData.sources) : []);
};

export {EntryService};
