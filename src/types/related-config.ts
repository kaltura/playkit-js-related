interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackPaused: boolean;
  playlistId: string | null;
  entryList: Array<KalturaPlayerTypes.MediaInfo>;
  sourcesList: Array<KalturaPlayerTypes.Sources>;
  useContext: boolean;
  entriesByContextLimit: number;
  ks: string;
}

export {RelatedConfig};
