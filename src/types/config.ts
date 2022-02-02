interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  playlistId: string | null;
  entryList?: Array<string>;
  useContext: boolean;
}

export {RelatedConfig};
