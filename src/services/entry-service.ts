import {EntryListResponse} from 'types/entry-list-response';
import {RelatedLoader} from './related-loader';

class EntryService {
  private player: KalturaPlayerTypes.Player;

  constructor(player: KalturaPlayerTypes.Player) {
    this.player = player;
  }

  async getByPlaylist(playlistInfo: {playlistId: string; ks?: string}): Promise<KalturaPlayerTypes.Sources[]> {
    try {
      const response: EntryListResponse = await this.player.provider.getPlaylistConfig(playlistInfo);
      return processResponse(response);
    } catch (e) {
      return [];
    }
  }

  async getByEntryList(entryList: {entries: any[]; ks?: string}): Promise<KalturaPlayerTypes.Sources[]> {
    try {
      const response: EntryListResponse = await this.player.provider.getEntryListConfig(entryList);
      return processResponse(response);
    } catch (e) {
      return [];
    }
  }

  getBySourcesList(sourcesList: any[]): KalturaPlayerTypes.Sources[] {
    return sourcesList.filter(sources => {
      return sources.dash?.length || sources.hls?.length || sources.progressive?.length;
    });
  }

  async getByContext(entryId: string, limit: number): Promise<KalturaPlayerTypes.Sources[]> {
    try {
      const response = await this.player.provider.doRequest([{loader: RelatedLoader, params: {entryId, limit}}]);
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
