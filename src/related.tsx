import {RelatedConfig} from './types/config';
import {RelatedManager} from 'related-manager';
import {RelatedOverlay} from 'components/related-overlay/related-overlay';
import {PrePlaybackPlayOverlayWrapper} from 'components/pre-playback-play-overlay-wrapper/pre-playback-play-overlay-wrapper';
import {Next} from 'components/next/next';
import {RelatedEvent} from 'types/related-event';

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
    showOnPlaybackDone: true,
    showOnPlaybackPaused: false,
    playlistId: null,
    entryList: [],
    sourcesList: [],
    useContext: false,
    entriesByContextLimit: 12
  };

  private relatedManager: RelatedManager;

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
      config: this.config,
      dispatchEvent: this.dispatchEvent.bind(this)
    });
    this.relatedManager.load();
    this.injectUIComponents();
  }

  private injectUIComponents() {
    const {relatedManager} = this;

    this.player.ui.addComponent({
      label: 'kaltura-related-grid',
      presets: PRESETS,
      area: 'GuiArea',
      get: () => <RelatedOverlay relatedManager={this.relatedManager} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-pre-playback-play-overlay',
      presets: PRESETS,
      area: 'GuiArea',
      get: () => <PrePlaybackPlayOverlayWrapper relatedManager={relatedManager} />,
      replaceComponent: KalturaPlayer.ui.components.PrePlaybackPlayOverlay.displayName
    });

    const nextProps = {
      onClick: () => relatedManager.playNext(),
      onLoaded: (cb: (nextEntries: []) => void) => {
        relatedManager.listen(RelatedEvent.ENTRIES_CHANGED, ({payload}: {payload: []}) => cb(payload));
        // in case entries were set before the handler was registered
        this.dispatchEvent(RelatedEvent.ENTRIES_CHANGED, relatedManager.entries);
      },
      onUnloaded: (cb: (nextEntries: []) => void) => {
        relatedManager.unlisten(RelatedEvent.ENTRIES_CHANGED, cb);
      }
    };

    this.player.ui.addComponent({
      label: 'kaltura-relayed-overlay-next',
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
}

export {Related};
