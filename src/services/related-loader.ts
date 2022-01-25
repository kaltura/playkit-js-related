const {RequestBuilder} = KalturaPlayer.providers;

class RelatedLoader implements KalturaPlayerTypes.ILoader {
  private entryId;
  requests: any[];

  _relatedEntries: any;

  static get id(): string {
    return 'related';
  }

  constructor({entryId}: {entryId: string}) {
    this.entryId = entryId;

    const userEntryRequest = new RequestBuilder();
    userEntryRequest.service = 'playlist';
    userEntryRequest.action = 'execute';
    userEntryRequest.params = {
      id: '_KDP_CTXPL',
      filter: {
        objectType: 'KalturaMediaEntryFilterForPlaylist',
        idNotIn: entryId,
        limit: 12
      },
      playlistContext: {
        objectType: 'KalturaEntryContext',
        entryId
      }
    };
    this.requests = [userEntryRequest];
  }

  set response(serverResponse: any) {
    const entries = serverResponse[0]?.data;
    this._relatedEntries = entries.map((entry: any) => {
      const {description, duration, id, name, thumbnailUrl: poster} = entry;
      return {
        id,
        poster,
        duration,
        description,
        metadata: {
          name
        }
      };
    });
  }

  get relatedEntries() {
    return this._relatedEntries;
  }

  isValid(): boolean {
    return true;
  }
}

export {RelatedLoader};
