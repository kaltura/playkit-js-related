import {EntryListResponse, Sources} from 'types';
import {RelatedLoader} from './related-loader';

import * as humanizeDuration from 'humanize-duration';

class EntryService {
  private player: KalturaPlayerTypes.Player;
  private logger: KalturaPlayerTypes.Logger;
  private getDurationText: (duration?: number) => string = (duration?: number) => (duration ? `${duration}` : '');

  constructor(player: KalturaPlayerTypes.Player, logger: KalturaPlayerTypes.Logger) {
    this.player = player;
    this.logger = logger;

    this.mapSources = this.mapSources.bind(this);

    try {
      const durationHumanizer = getDurationHumanizer(this.player?.config?.ui);
      if (durationHumanizer) {
        this.getDurationText = (duration?: number) => {
          try {
            return duration ? durationHumanizer(duration * 1000) : '';
          } catch (e: any) {
            return `${duration}`;
          }
        };
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  private mapSources(sources: KalturaPlayerTypes.Sources, index: number): Sources {
    {
      return {
        ...sources,
        internalIndex: index,
        durationText: this.getDurationText(sources.duration)
      };
    }
  }

  async getByPlaylist(playlistInfo: {playlistId: string; ks?: string}): Promise<Sources[]> {
    try {
      const response: EntryListResponse = await this.player.provider.getPlaylistConfig(playlistInfo);
      return response.items.map(({sources}: {sources: KalturaPlayerTypes.Sources}) => sources).map(this.mapSources);
    } catch (e) {
      this.logger.warn(`failed to get related entries by playlist id ${playlistInfo.playlistId}`);
      return [];
    }
  }

  async getByEntryList(entryList: {entries: KalturaPlayerTypes.MediaInfo[]; ks?: string}): Promise<Sources[]> {
    try {
      const response: EntryListResponse = await this.player.provider.getEntryListConfig(entryList);
      return response.items.map(({sources}: {sources: KalturaPlayerTypes.Sources}) => sources).map(this.mapSources);
    } catch (e) {
      this.logger.warn(`failed to get related entries by entry list`);
      return [];
    }
  }

  getBySourcesList(sourcesList: KalturaPlayerTypes.Sources[]): Sources[] {
    return sourcesList.filter(sources => this.isPlayable(sources)).map(this.mapSources);
  }

  async getByContext(entryId: string, limit: number): Promise<Sources[]> {
    try {
      const response = await this.player.provider.doRequest([{loader: RelatedLoader, params: {entryId, limit}}]);
      return response.get('related').relatedEntries.map(this.mapSources);
    } catch (e) {
      this.logger.warn(`failed to get related entries by context`);
      return [];
    }
  }

  isPlayable(sources: KalturaPlayerTypes.Sources) {
    return sources.dash?.length || sources.hls?.length || sources.progressive?.length;
  }
}

const getDurationHumanizer = ({locale}: any) => {
  const languages = ['en'];
  if (locale) {
    if (locale.match('_')) {
      languages.unshift(locale.split('_')[0]);
    }
    languages.unshift(locale);
  }

  const supportedLanguages = new Map(humanizeDuration.getSupportedLanguages().map((language: string) => [language.toLowerCase(), language]));
  for (const language of languages) {
    try {
      if (supportedLanguages.has(language)) {
        return humanizeDuration.humanizer({language: supportedLanguages.get(language)});
      }
    } catch (e: any) {}
  }

  return null;
};

export {EntryService};
