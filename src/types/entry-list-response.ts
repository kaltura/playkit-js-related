interface EntryListResponse {
  items: Array<EntryData>;
}

interface EntryData {
  sources: KalturaPlayerTypes.Sources;
}

export {EntryListResponse, EntryData};
