const {RequestBuilder} = KalturaPlayer.providers;

class RelatedLoader implements KalturaPlayerTypes.ILoader {
  private entryId;
  requests: any[];

  _relatedEntries: any;

  static get id(): string {
    return 'related';
  }

  constructor({entryId, limit}: {entryId: string; limit: number}) {
    this.entryId = entryId;

    const userEntryRequest = new RequestBuilder();
    userEntryRequest.service = 'playlist';
    userEntryRequest.action = 'execute';
    userEntryRequest.params = {
      id: '_KDP_CTXPL',
      filter: {
        objectType: 'KalturaMediaEntryFilterForPlaylist',
        idNotIn: entryId,
        limit
      },
      playlistContext: {
        objectType: 'KalturaEntryContext',
        entryId
      }
    };
    this.requests = [userEntryRequest];
  }

  set response([response]: [any]) {
    if (!response.hasError && response.data?.length) {
      const entries = response.data.map((entry: any) => {
        return {
          ...entry,
          poster: entry.thumbnailUrl
        };
      });
      const parsedResponse = KalturaPlayer.providers.OVPProviderParser.getEntryList({
        playlistItems: {
          entries
        }
      });
      this._relatedEntries = parsedResponse.items;
    }
  }

  get relatedEntries() {
    return this._relatedEntries;
  }

  isValid(): boolean {
    return true;
  }
}

export {RelatedLoader};
