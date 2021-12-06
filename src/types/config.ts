import { RelatedEntriesSourceOptions } from "./related-entries-source-options";

interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  relatedEntriesSource: RelatedEntriesSourceOptions;
}

export default RelatedConfig;
