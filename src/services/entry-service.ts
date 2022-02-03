import {EntryListResponse} from 'types/entry-list-response';
import {RelatedLoader} from './related-loader';

class EntryService {
  _player: KalturaPlayerTypes.Player;

  constructor(player: KalturaPlayerTypes.Player) {
    this._player = player;
  }

  async getEntriesByPlaylistId(playlistId: string): Promise<KalturaPlayerTypes.Sources[]> {
    try {
      const response: EntryListResponse = await this._player.provider.getPlaylistConfig({playlistId});
      return processResponse(response);
    } catch (e) {
      return [];
    }
  }

  async getEntriesByEntryIds(entryIds: string[]): Promise<KalturaPlayerTypes.Sources[]> {
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

  getEntriesByConfig(sourcesList: any[]): KalturaPlayerTypes.Sources[] {
    return sourcesList
      .filter(sources => {
        return sources.dash?.length || sources.hls?.length || sources.progressive?.length;
      })
      .map((sources, index) => {
        const id = sources.id || index.toString();
        const type = sources.type;
        const name = sources.metadata?.name;
        const duration = sources.duration;
        const description = sources.metadata?.description;
        const poster = sources.poster;
        const hls = sources.hls;
        const dash = sources.dash;
        const progressive = sources.progressive;

        return {
          id,
          type,
          poster,
          duration,
          description,
          metadata: {name},
          hls,
          dash,
          progressive
        };
      });
  }

  async getEntriesByContext(entryId: string): Promise<KalturaPlayerTypes.Sources[]> {
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
