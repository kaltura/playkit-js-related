import {RelatedInternalEvent, RelatedEvent} from 'event';
import {EntryService, ImageService} from 'services';
import {RelatedConfig, Sources} from 'types';
/**
 * Manages the plugin state.
 *
 * @class RelatedManager
 */
class RelatedManager extends KalturaPlayer.core.FakeEventTarget {
  /**
   * Kaltura player instance.
   *
   * @private
   * @type {KalturaPlayerTypes.Player}
   * @memberof RelatedManager
   */
  private player: KalturaPlayerTypes.Player;

  /**
   * Logger instance.
   *
   * @private
   * @type {KalturaPlayerTypes.Logger}
   * @memberof RelatedManager
   */
  private logger: KalturaPlayerTypes.Logger;

  /**
   * Event manager instance.
   *
   * @private
   * @type {KalturaPlayerTypes.EventManager}
   * @memberof RelatedManager
   */
  private eventManager: KalturaPlayerTypes.EventManager;

  /**
   * Service used to fetch related entries.
   *
   * @private
   * @type {EntryService}
   * @memberof RelatedManager
   */
  private entryService: EntryService;

  /**
   * Related entries data.
   *
   * @private
   * @type {Sources[]}
   * @memberof RelatedManager
   */
  private _entries: Sources[] = [];

  /**
   * Related plugin configuration.
   *
   * @private
   * @type {(RelatedConfig | null)}
   * @memberof RelatedManager
   */
  private config: RelatedConfig | null = null;

  /**
   * Indicates whether the related manager has already been initialized, by calling load() at least once.
   *
   * @private
   * @memberof RelatedManager
   */
  private _isInitialized = false;

  /**
   * Indicates whether auto continue been cancelled.
   *
   * @private
   * @memberof RelatedManager
   */
  private _isAutoContinueCancelled = false;

  /**
   * Cache for entry metadata by entry id.
   *
   * @private
   * @type {Map<string, KalturaPlayerTypes.MediaInfo>}
   * @memberof RelatedManager
   */
  private mediaInfoMap: Map<string, KalturaPlayerTypes.MediaInfo> = new Map();

  /**
   * Timeout handle of for the autocontinue timeout handler.
   *
   * @private
   * @memberof RelatedManager
   */
  private nextEntryTimeoutId = -1;

  /**
   * Indicates whether the related grid is visible or not.
   *
   * @private
   * @memberof RelatedManager
   */
  private _isGridVisible = false;

  /**
   * Indicates whether the related list is visible or not.
   *
   * @private
   * @memberof RelatedManager
   */
  private _isListVisible = false;

  /**
   * Service used to fetch entry thumbnails.
   *
   * @private
   * @type {ImageService}
   * @memberof RelatedManager
   */
  private imageService: ImageService;

  constructor({player, logger, eventManager}: KalturaPlayerTypes.BasePlugin) {
    super();

    this.playNext = this.playNext.bind(this);
    this.player = player;
    this.logger = logger;
    this.eventManager = eventManager;

    this.entryService = new EntryService(player, logger);
    this.imageService = new ImageService(player);
  }

  /**
   * Cycle the related entries by pushing the index of the selected entry to the end of the list.
   *
   * @private
   * @param {number} lastPlayedIndex index of the last played entry
   * @memberof RelatedManager
   */
  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);

    this.entries = [...this._entries, lastPlayedEntry].map((entry, index) => {
      return {
        ...entry,
        internalIndex: index
      };
    });
  }

  /**
   * Play an entry by index.
   *
   * @private
   * @param {number} index index of the selected entry to play
   * @memberof RelatedManager
   */
  private playByIndex(index: number) {
    this.clearNextEntryTimeout();
    this.isAutoContinueCancelled = false;
    if (this.entryService.isPlayable(this.entries[index])) {
      this.player.setMedia({sources: this.entries[index]});
      this.player.play();
    } else {
      const entryId = this.entries[index].id;
      const mediaInfo = this.mediaInfoMap?.has(entryId) ? this.mediaInfoMap.get(entryId) : {entryId};

      this.player
        .loadMedia({...mediaInfo})
        .then(() => {
          this.logger.info('loadMedia success');
          this.player.play();
        })
        .catch(() => {
          this.logger.warn('loadMedia failed');
        });
    }
    this.cycleEntries(index);
  }

  /**
   * Load related entries list according to the configuration options.
   *
   * @param {RelatedConfig} config related plugin config
   * @memberof RelatedManager
   */
  async load(config: RelatedConfig) {
    this.config = config;
    this.mediaInfoMap.clear();

    const {playlistId, entryList, sourcesList, useContext, entriesByContextLimit} = config;
    let entries: Sources[] = [];

    if (this.player.playlist?.items?.length) {
      // disable plugin if the player is in playlist playback mode
    } else if (playlistId) {
      entries = await this.entryService.getByPlaylist({playlistId});
    } else if (entryList?.length) {
      entries = await this.entryService.getByEntryList({entries: entryList});
      entryList.forEach(mediaInfo => {
        if (typeof mediaInfo === 'object' && mediaInfo.entryId && entries.find(entry => entry.id === mediaInfo.entryId)) {
          this.mediaInfoMap.set(mediaInfo.entryId, mediaInfo);
        }
      });
    } else if (sourcesList?.length) {
      entries = this.entryService.getBySourcesList(sourcesList);
    } else if (useContext) {
      entries = await this.entryService.getByContext(this.player.sources.id, entriesByContextLimit);
    } else {
      this.logger.warn('no source configured');
    }

    if (!entries.length) {
      this.logger.warn('no related entries found');
    }

    this.entries = entries;
    this._isInitialized = true;
  }

  /**
   * Restart current entry playback.
   *
   * @memberof RelatedManager
   */
  startOver() {
    this.isAutoContinueCancelled = false;
    this.player.play();
  }

  /**
   * Play the next entry in the list.
   *
   * @param {number} [seconds] seconds to wait before next entry playback
   * @memberof RelatedManager
   */
  playNext(seconds?: number) {
    this.logger.info('going to play next entry');

    if (seconds && seconds > 0) {
      this.clearNextEntryTimeout();
      this.nextEntryTimeoutId = window.setTimeout(() => {
        this.playByIndex(0);
        this.player.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_ENTRY_AUTO_PLAYED));
      }, seconds * 1000);
    } else {
      this.playByIndex(0);
    }
  }

  /**
   * Play the selected entry.
   *
   * @param {number} internalIndex index of the entry to be played
   * @memberof RelatedManager
   */
  playSelected(internalIndex: number) {
    this.logger.info('going to play selected entry');
    this.playByIndex(internalIndex);
    this.player.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_ENTRY_SELECTED));
  }

  /**
   * Clear next entry auto continue timeout.
   *
   * @memberof RelatedManager
   */
  clearNextEntryTimeout() {
    clearTimeout(this.nextEntryTimeoutId);
    this.nextEntryTimeoutId = -1;
  }

  /**
   * Register an event listener for a plugin event.
   *
   * @param {string} name event name
   * @param {*} listener callback function
   * @memberof RelatedManager
   */
  listen(name: string, listener: any) {
    this.eventManager.listen(this, name, listener);
  }

  /**
   * Unregister an event listener for a plugin event.
   *
   * @param {string} name event name
   * @param {*} listener callback function
   * @memberof RelatedManager
   */
  unlisten(name: string, listener: any) {
    this.eventManager.unlisten(this, name, listener);
  }

  /**
   * Get url of an entry thumbnail image.
   * If possible, get an entry with specific dimensions.
   *
   * @param {string} url initial thumbnail url
   * @returns {*}  {(Promise<string | null>)} promise which returns the full url or null if failed to load
   * @memberof RelatedManager
   */
  getImageUrl(url: string): Promise<string | null> {
    return this.imageService.getImageUrl(url);
  }

  /**
   * Set auto continue cancelled state and fire AUTO_CONTINUE_CANCELLED_CHANGED event
   *
   * @memberof RelatedManager
   */
  set isAutoContinueCancelled(isAutoContinueCancelled: boolean) {
    this._isAutoContinueCancelled = isAutoContinueCancelled;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedInternalEvent.AUTO_CONTINUE_CANCELLED_CHANGED, isAutoContinueCancelled));
  }

  /**
   * Indicates whether auto continue has been cancelled.
   *
   * @memberof RelatedManager
   */

  get isAutoContinueCancelled() {
    return this._isAutoContinueCancelled;
  }

  /**
   * Indicates whether the related grid should be visible on playback paused.
   *
   * @readonly
   * @type {boolean}
   * @memberof RelatedManager
   */
  get showOnPlaybackPaused(): boolean {
    return this.config?.showOnPlaybackPaused || false;
  }

  /**
   * If autoContinue is true, returns the time to wait after playback and before playing the next entry.
   *
   * @readonly
   * @type {number}
   * @memberof RelatedManager
   */
  get countdownTime(): number {
    return this.config?.autoContinue && Number.isInteger(this.config?.autoContinueTime) ? this.config.autoContinueTime : -1;
  }

  /**
   * Set related entries array and fire RELATED_ENTRIES_CHANGED event.
   *
   * @memberof RelatedManager
   */
  set entries(entries: Sources[]) {
    this.logger.info(`related entries changed`);
    this._entries = entries;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedInternalEvent.RELATED_ENTRIES_CHANGED, this._entries));
  }

  /**
   * Get related entries array.
   *
   * @type {Sources[]}
   * @memberof RelatedManager
   */
  get entries(): Sources[] {
    return this._entries;
  }

  /**
   * Indicates whether the related manager has already been initialized by calling load() at least once.
   *
   * @readonly
   * @type {boolean}
   * @memberof RelatedManager
   */
  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Indicates whether the grid is crrently visible.
   *
   * @type {boolean}
   * @memberof RelatedManager
   */
  get isGridVisible(): boolean {
    return this._isGridVisible;
  }

  /**
   * Set grid visibility inidication and fire GRID_VISIBILITY_CHANGED event.
   *
   * @memberof RelatedManager
   */
  set isGridVisible(isGridVisible: boolean) {
    this._isGridVisible = isGridVisible;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedInternalEvent.GRID_VISIBILITY_CHANGED, this._isGridVisible));
    if (isGridVisible) this.player.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_GRID_DISPLAYED));
  }

  /**
   * Indicates whether the list is currently visible.
   *
   * @type {boolean}
   * @memberof RelatedManager
   */
  get isListVisible(): boolean {
    return this._isListVisible;
  }

  /**
   * Set list visibility indication.
   *
   * @memberof RelatedManager
   */
  updateListVisibility(isListVisible: boolean, userInteraction = false) {
    this._isListVisible = isListVisible;
    if (userInteraction) {
      this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedInternalEvent.LIST_VISIBILITY_CHANGED, this._isListVisible));
      if (isListVisible) {
        this.player.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_OPEN, {expandMode: this.config?.expandMode}));
      } else {
        this.player.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_CLOSE, {expandMode: this.config?.expandMode}));
      }
    }
  }
}

export {RelatedManager};
