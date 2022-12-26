/**
 *
 * configuration parameters for related plugin
 *
 * @interface RelatedConfig
 */
interface RelatedConfig {
  /**
   *
   * if true, continue to to next related entry after playback end
   *
   * @type {boolean}
   * @memberof RelatedConfig
   * @default true
   */
  autoContinue: boolean;
  /**
   *
   * if autoContinue is true, sets the time in seconds to wait after playback end and before continuing to the next entry
   *
   * @type {number}
   * @memberof RelatedConfig
   * @default 5
   */
  autoContinueTime: number;
  /**
   *
   * if true, show related grid on playback paused
   *
   * @type {boolean}
   * @memberof RelatedConfig
   * @default false
   */
  showOnPlaybackPaused: boolean;
  /**
   *
   * if set, related entries will fetched according to this playlist
   *
   * @type {(string | null)}
   * @memberof RelatedConfig
   * @default null
   */
  playlistId: string | null;
  /**
   *
   * if set, and playlistId is not set, related entries will be fetched according to the items in this list
   *
   * @type {Array<KalturaPlayerTypes.MediaInfo>}
   * @memberof RelatedConfig
   * @default []
   */
  entryList: Array<KalturaPlayerTypes.MediaInfo>;
  /**
   *
   * if set, and playlistId and entryList are not set, explicitly defines the Sources to be used as related entries
   *
   * @type {Array<KalturaPlayerTypes.Sources>}
   * @memberof RelatedConfig
   * @default []
   */
  sourcesList: Array<KalturaPlayerTypes.Sources>;
  /**
   *
   * if true, and the other 3 options for related entries were not set, fetch related entries using the metadata of the current entry
   *
   * @type {boolean}
   * @memberof RelatedConfig
   * @default true
   */
  useContext: boolean;
  /**
   *
   * limits the number of entries to be fetched when fetching related entries by context
   *
   * @type {number}
   * @memberof RelatedConfig
   * @default 12
   */
  entriesByContextLimit: number;
  /**
   *
   * position of the related list (top, down, left, right)
   *
   * @type {string}
   * @memberof RelatedConfig
   * @default "right"
   */
  position: string;
  /**
   *
   * defines the relation between the position of the player and of the related list (over, alongside, hidden)
   *
   * @type {string}
   * @memberof RelatedConfig
   * @default "alongside"
   * @
   */
  expandMode: string;
}

export {RelatedConfig};
