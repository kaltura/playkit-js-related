/**
 * Configuration parameters for related plugin.
 *
 * @interface RelatedConfig
 */
interface RelatedConfig {
  /**
   *
   * Indicates whether to continue to to next related entry after playback end.
   *
   * @type {boolean}
   * @memberof RelatedConfig
   * @default true
   */
  autoContinue: boolean;
  /**
   *
   * If autoContinue is true, indicates the time in seconds to wait after playback end and before continuing to the next entry.
   *
   * @type {number}
   * @memberof RelatedConfig
   * @default 5
   */
  autoContinueTime: number;
  /**
   *
   * Indicates whether the related grid should be visible on playback paused.
   *
   * @type {boolean}
   * @memberof RelatedConfig
   * @default false
   */
  showOnPlaybackPaused: boolean;
  /**
   *
   * If set, related entries will fetched according to this playlist.
   *
   * @type {(string | null)}
   * @memberof RelatedConfig
   * @default null
   */
  playlistId: string | null;
  /**
   * If set, and playlistId is not set, related entries will be fetched according to the items in this list.
   *
   * @type {Array<KalturaPlayerTypes.MediaInfo>}
   * @memberof RelatedConfig
   * @default []
   */
  entryList: Array<KalturaPlayerTypes.MediaInfo>;
  /**
   * If set, and playlistId and entryList are not set, this data will be used to set the related entries, without fetching any additional information.
   *
   * @type {Array<KalturaPlayerTypes.Sources>}
   * @memberof RelatedConfig
   * @default []
   */
  sourcesList: Array<KalturaPlayerTypes.Sources>;
  /**
   *
   * If true, and the three other options for related entries were not set, related entries will be fetched using the metadata of the current entry.
   *
   * @type {boolean}
   * @memberof RelatedConfig
   * @default true
   */
  useContext: boolean;
  /**
   *
   * Max number of entries which can be fetched when fetching related entries by context.
   *
   * @type {number}
   * @memberof RelatedConfig
   * @default 12
   */
  entriesByContextLimit: number;
  /**
   *
   * Position of the related list (top, down, left, right).
   *
   * @type {string}
   * @memberof RelatedConfig
   * @default "right"
   */
  position: string;
  /**
   *
   * The relation between the position of the player and of the related list (over, alongside).
   *
   * @type {string}
   * @memberof RelatedConfig
   * @default "alongside"
   * @
   */
  expandMode: string;
}

export {RelatedConfig};
