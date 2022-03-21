import {RelatedConfig} from './types/config';
import {RelatedManager} from 'related-manager';
import {RelatedOverlay} from 'components/related-overlay/related-overlay';
import {Next} from 'components/next/next';
import {RelatedEvent} from 'types/related-event';
import {PrePlaybackPlayOverlayWrapper} from 'components/pre-playback-play-overlay-wrapper/pre-playback-play-overlay-wrapper';

const PRESETS = ['Playback', 'Live'];

/**
 * Related class.
 * @classdesc
 */
class Related extends KalturaPlayer.core.BasePlugin {
  /**
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   */
  static defaultConfig: RelatedConfig = {
    autoContinue: true,
    autoContinueTime: 5,
    showOnPlaybackPaused: false,
    playlistId: null,
    entryList: [],
    externalEntryList: [],
    useContext: false,
    entriesByContextLimit: 12,
    ks: ''
  };

  private relatedManager: RelatedManager;
  private ks = '';

  /**
   * @static
   * @public
   * @returns {boolean} - Whether the plugin is valid.
   */
  static isValid(): boolean {
    return true;
  }

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player instance.
   * @param {Object} config - The plugin config.
   */
  constructor(name: string, player: KalturaPlayerTypes.Player, config: RelatedConfig) {
    super(name, player, config);
    this.relatedManager = new RelatedManager({
      player,
      eventManager: this.eventManager,
      dispatchEvent: this.dispatchEvent.bind(this),
      logger: this.logger
    });
    this.injectUIComponents();
  }

  private injectUIComponents() {
    const {relatedManager} = this;

    this.player.ui.addComponent({
      label: 'kaltura-related-grid',
      presets: PRESETS,
      area: 'GuiArea',
      get: () => <RelatedOverlay relatedManager={relatedManager} />
    });

    const preplayBackPlayOverlayProps = {
      relatedManager,
      onLoaded: (callback: (nextEntries: []) => void) => {
        relatedManager.listen(RelatedEvent.HIDDEN_STATE_CHANGED, ({payload}: {payload: []}) => callback(payload));
      },
      onUnloaded: (cb: (nextEntries: []) => void) => {
        relatedManager.unlisten(RelatedEvent.HIDDEN_STATE_CHANGED, cb);
      }
    };

    this.player.ui.addComponent({
      label: 'kaltura-related-pre-playback-play-overlay',
      presets: PRESETS,
      area: 'GuiArea',
      get: () => <PrePlaybackPlayOverlayWrapper {...preplayBackPlayOverlayProps} />,
      replaceComponent: KalturaPlayer.ui.components.PrePlaybackPlayOverlay.displayName
    });

    const nextProps = {
      onClick: () => relatedManager.playNext(),
      onLoaded: (callback: (nextEntries: []) => void) => {
        relatedManager.listen(RelatedEvent.RELATED_ENTRIES_CHANGED, ({payload}: {payload: []}) => callback(payload));
        // in case entries were set before the handler was registered
        this.dispatchEvent(RelatedEvent.RELATED_ENTRIES_CHANGED, relatedManager.entries);
      },
      onUnloaded: (cb: (nextEntries: []) => void) => {
        relatedManager.unlisten(RelatedEvent.RELATED_ENTRIES_CHANGED, cb);
      }
    };

    this.player.ui.addComponent({
      label: 'kaltura-related-overlay-next',
      presets: PRESETS,
      area: 'OverlayPlaybackControls',
      get: () => <Next {...nextProps} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-bottom-bar-next',
      presets: PRESETS,
      area: 'BottomBarPlaybackControls',
      get: () => <Next {...nextProps} />
    });
  }

  loadMedia() {
    const {ks, config, relatedManager} = this;
    const {useContext, playlistId, entryList} = config;
    const newKs = this.config?.ks;

    relatedManager.isHiddenByUser = false;

    if (!relatedManager.isInitialized) {
      // first loadMedia
      relatedManager.load(config, newKs);
    } else if (ks && ks !== newKs) {
      // ks changed
      this.ks = newKs;
      if (useContext || playlistId || entryList?.length) {
        this.logger.info('ks changed - reloading related entries');
        relatedManager.load(config, newKs);
      }
    } else if (useContext) {
      // ks didn't change, refresh context entries anyway
      relatedManager.load(config, newKs);
    }
  }
}

export {Related};
