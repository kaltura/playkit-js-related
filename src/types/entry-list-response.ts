interface EntryListResponse {
  items: Array<EntryListItem>;
}

interface EntryListItem {
  sources: KalturaPlayerTypes.Sources;
}

export { EntryListResponse, EntryListItem };
