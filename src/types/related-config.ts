interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackPaused: boolean;
  playlistId: string | null;
  entryList: Array<KalturaPlayerTypes.MediaInfo>;
  sourcesList: Array<KalturaPlayerTypes.Sources>;
  useContext: boolean;
  entriesByContextLimit: number;
  position: string;
  expandMode: string;
}

export {RelatedConfig};
