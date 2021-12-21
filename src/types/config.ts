export interface RelatedEntriesSourceOptions {
  //useContext?: boolean;
  playlistId?: string;
  entryList?: Array<string>; // => ProviderMediaInfoObject
  //sourcesList: Array<?>
}
interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  playlistId?: string;
  entryList?: Array<string>; // => ProviderMediaInfoObject
  // TODO use this instead ?
  //relatedEntriesSource: RelatedEntriesSourceOptions;
}

export default RelatedConfig;
