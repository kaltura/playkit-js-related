import {EntryListResponse} from 'types/entry-list-response';
import {RelatedLoader} from './related-loader';

class EntryService {
  private player: KalturaPlayerTypes.Player;
  private logger: KalturaPlayerTypes.Logger;

  constructor(player: KalturaPlayerTypes.Player, logger: KalturaPlayerTypes.Logger) {
    this.player = player;
    this.logger = logger;
  }

  async getByPlaylist(playlistInfo: {playlistId: string; ks?: string}): Promise<KalturaPlayerTypes.Sources[]> {
    try {
      const response: EntryListResponse = await this.player.provider.getPlaylistConfig(playlistInfo);
      return processResponse(response);
    } catch (e) {
      this.logger.warn(`failed to get related entries by playlist id ${playlistInfo.playlistId}`);
      return [];
    }
  }

  async getByEntryList(entryList: {entries: KalturaPlayerTypes.MediaInfo[]; ks?: string}): Promise<KalturaPlayerTypes.Sources[]> {
    try {
      const response: EntryListResponse = await this.player.provider.getEntryListConfig(entryList);
      return processResponse(response);
    } catch (e) {
      this.logger.warn(`failed to get related entries by entry list`);
      return [];
    }
  }

  getBySourcesList(sourcesList: KalturaPlayerTypes.Sources[]): KalturaPlayerTypes.Sources[] {
    return sourcesList.filter(sources => this.isPlayable(sources));
  }

  async getByContext(entryId: string, ks: string, limit: number): Promise<KalturaPlayerTypes.Sources[]> {
    try {
      const response = await this.player.provider.doRequest([{loader: RelatedLoader, params: {entryId, limit}}], ks);
      return response.get('related').relatedEntries;
    } catch (e) {
      this.logger.warn(`failed to get related entries by context`);
      return [];
    }
  }

  isPlayable(sources: KalturaPlayerTypes.Sources) {
    return sources.dash?.length || sources.hls?.length || sources.progressive?.length;
  }
}

const processResponse = (response: EntryListResponse) => {
  return Promise.resolve(response.items.length ? response.items.map(entryData => entryData.sources) : []);
};

export {EntryService};
