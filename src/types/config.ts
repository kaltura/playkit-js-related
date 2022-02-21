interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  playlist: {
    playlistId: string;
    ks?: string;
  } | null;
  entryList: {
    entries: Array<any>;
    ks?: string;
  } | null;
  externalEntryList: Array<KalturaPlayerTypes.Sources>;
  useContext: boolean;
  entriesByContextLimit: number;
}

export {RelatedConfig};
