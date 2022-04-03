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
    sourcesList: [],
    useContext: true,
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
    this.relatedManager = new RelatedManager(this);
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
        // eslint-disable-next-line no-self-assign
        relatedManager.entries = relatedManager.entries;
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
    const {useContext, playlistId, entryList, sourcesList} = config;
    const newKs = this.config?.ks;

    relatedManager.isHiddenByUser = false;

    if (!relatedManager.isInitialized) {
      relatedManager.load(config, newKs);
    } else if (playlistId || entryList?.length) {
      if (ks && ks !== newKs) {
        this.logger.info('ks changed - reloading related entries');
        relatedManager.load(config, newKs);
      }
    } else if (!sourcesList?.length && useContext) {
      // refresh context entries
      relatedManager.load(config, newKs);
    }
  }
}

export {Related};
