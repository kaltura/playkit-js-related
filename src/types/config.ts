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
  // TODO use this
  //relatedEntriesSource: RelatedEntriesSourceOptions;
}

export default RelatedConfig;
