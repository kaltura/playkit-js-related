interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  playlistId: string | null;
  entryList: Array<string>;
  sourcesList: Array<any>;
  useContext: boolean;
}

export {RelatedConfig};
