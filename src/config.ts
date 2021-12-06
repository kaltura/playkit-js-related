import { RelatedEntriesSourceOptions } from "./related-entries-source-options";

export interface RelatedConfig {
  autoContinue: boolean;
  autoContinueTime: number;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  relatedEntriesSource: RelatedEntriesSourceOptions;
}
