import {EntryService, ImageService} from 'services';
import {RelatedConfig, RelatedEvent, Sources} from 'types';
/**
 * related manager is used to hold the state of the plugin and control its behavior
 *
 * @class RelatedManager
 */
class RelatedManager extends KalturaPlayer.core.FakeEventTarget {
  /**
   * kaltura player instance
   *
   * @private
   * @type {KalturaPlayerTypes.Player}
   * @memberof RelatedManager
   */
  private player: KalturaPlayerTypes.Player;

  /**
   * logger object
   *
   * @private
   * @type {KalturaPlayerTypes.Logger}
   * @memberof RelatedManager
   */
  private logger: KalturaPlayerTypes.Logger;

  /**
   * event manager instance
   *
   * @private
   * @type {KalturaPlayerTypes.EventManager}
   * @memberof RelatedManager
   */
  private eventManager: KalturaPlayerTypes.EventManager;

  /**
   * service used to fetch related entries
   *
   * @private
   * @type {EntryService}
   * @memberof RelatedManager
   */
  private entryService: EntryService;

  /**
   * related entries array
   *
   * @private
   * @type {Sources[]}
   * @memberof RelatedManager
   */
  private _entries: Sources[] = [];

  /**
   * related plugin configuration
   *
   * @private
   * @type {(RelatedConfig | null)}
   * @memberof RelatedManager
   */
  private config: RelatedConfig | null = null;

  /**
   * indicates whether the related manager has already been initialized by calling load() at least once
   *
   * @private
   * @memberof RelatedManager
   */
  private _isInitialized = false;

  /**
   * indicates whether the next entry preview has been manually hidden by the user
   *
   * @private
   * @memberof RelatedManager
   */
  private _isHiddenByUser = false;

  /**
   * cache for media info entry metadata objecys
   *
   * @private
   * @type {Map<string, KalturaPlayerTypes.MediaInfo>}
   * @memberof RelatedManager
   */
  private mediaInfoMap: Map<string, KalturaPlayerTypes.MediaInfo> = new Map();

  /**
   * handle for a setTimeout used during auto continue
   *
   * @private
   * @memberof RelatedManager
   */
  private nextEntryTimeoutId = -1;

  /**
   * indicates whether the related grid is visible or not
   *
   * @private
   * @memberof RelatedManager
   */
  private _isGridVisible = false;

  /**
   * indicates whether the related list is visible or not
   *
   * @private
   * @memberof RelatedManager
   */
  private _isListVisible = false;

  /**
   * service used to fetch entry thumbnails
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
   * cycle the related entries by pushing the index of the selected entry to the end of the list
   *
   * @private
   * @param {number} lastPlayedIndex index of the last played entry
   * @memberof RelatedManager
   */
  private cycleEntries(lastPlayedIndex: number) {
    const lastPlayedEntry = this._entries[lastPlayedIndex];
    this._entries.splice(lastPlayedIndex, 1);
    this.entries = [...this._entries, lastPlayedEntry];
  }

  /**
   * play a selected entry
   *
   * @private
   * @param {number} index index of the selected entry to play
   * @memberof RelatedManager
   */
  private playByIndex(index: number) {
    this.clearNextEntryTimeout();
    this.isHiddenByUser = false;
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
   * load related entries list according to the configuration options
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
   * restart current entry playback
   *
   * @memberof RelatedManager
   */
  startOver() {
    this.isHiddenByUser = false;
    this.player.play();
  }

  /**
   * play the next entry in the list
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
      }, seconds * 1000);
    } else {
      this.playByIndex(0);
    }
  }

  /**
   * playByIndex wrapper function
   *
   * @param {number} internalIndex index of the entry to be played
   * @memberof RelatedManager
   */
  playSelected(internalIndex: number) {
    this.logger.info('going to play selected entry');
    this.playByIndex(internalIndex);
  }

  /**
   * clear timeout for next entry auto continue
   *
   * @memberof RelatedManager
   */
  clearNextEntryTimeout() {
    clearTimeout(this.nextEntryTimeoutId);
    this.nextEntryTimeoutId = -1;
  }

  /**
   * register an event listener
   *
   * @param {string} name event name
   * @param {*} listener callback function
   * @memberof RelatedManager
   */
  listen(name: string, listener: any) {
    this.eventManager.listen(this, name, listener);
  }

  /**
   * unregister an event listener
   *
   * @param {string} name event name
   * @param {*} listener callback function
   * @memberof RelatedManager
   */
  unlisten(name: string, listener: any) {
    this.eventManager.unlisten(this, name, listener);
  }

  /**
   * get full url of an entry thumbnail image, including dimensions - if it's a kaltura image which supports custom dimensions
   *
   * @param {string} url initial thumbnail url
   * @returns {*}  {(Promise<string | null>)} promise which returns the full url or null if failed to load
   * @memberof RelatedManager
   */
  getImageUrl(url: string): Promise<string | null> {
    return this.imageService.getImageUrl(url);
  }

  /**
   * indicates whether the next entry preview has been manually hidden by the user
   *
   * @memberof RelatedManager
   */
  set isHiddenByUser(isHiddenByUser: boolean) {
    this._isHiddenByUser = isHiddenByUser;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.HIDDEN_STATE_CHANGED, isHiddenByUser));
  }

  /**
   * indicates whether the related grid should be visible on playback paused
   *
   * @readonly
   * @type {boolean}
   * @memberof RelatedManager
   */
  get showOnPlaybackPaused(): boolean {
    return this.config?.showOnPlaybackPaused || false;
  }

  /**
   * if autoContinue is true, returns the time to wait after playback and before playing the next entry
   *
   * @readonly
   * @type {number}
   * @memberof RelatedManager
   */
  get countdownTime(): number {
    return this.config?.autoContinue && Number.isInteger(this.config?.autoContinueTime) ? this.config.autoContinueTime : -1;
  }

  /**
   * set related entries and fire RELATED_ENTRIES_CHANGED event
   *
   * @memberof RelatedManager
   */
  set entries(entries: Sources[]) {
    this.logger.info(`related entries changed`);
    this._entries = entries;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.RELATED_ENTRIES_CHANGED, this._entries));
  }

  /**
   * get related entries
   *
   * @type {Sources[]}
   * @memberof RelatedManager
   */
  get entries(): Sources[] {
    return this._entries;
  }

  /**
   * indicates whether the related manager has already been initialized by calling load() at least once
   *
   * @readonly
   * @type {boolean}
   * @memberof RelatedManager
   */
  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * get grid visibility indication
   *
   * @type {boolean}
   * @memberof RelatedManager
   */
  get isGridVisible(): boolean {
    return this._isGridVisible;
  }

  /**
   * set related grid visibility inidication and fire GRID_VISIBILITY_CHANGED event
   *
   * @memberof RelatedManager
   */
  set isGridVisible(isGridVisible: boolean) {
    this._isGridVisible = isGridVisible;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.GRID_VISIBILITY_CHANGED, this._isGridVisible));
  }

  /**
   * get related list visibility indication
   *
   * @type {boolean}
   * @memberof RelatedManager
   */
  get isListVisible(): boolean {
    return this._isListVisible;
  }

  /**
   * set related list visibility indication
   *
   * @memberof RelatedManager
   */
  set isListVisible(isListVisible: boolean) {
    this._isListVisible = isListVisible;
    this.dispatchEvent(new KalturaPlayer.core.FakeEvent(RelatedEvent.LIST_VISIBILITY_CHANGED, this._isListVisible));
  }
}

export {RelatedManager};
