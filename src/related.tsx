import {RelatedConfig} from './types/config';
import {RelatedManager} from 'related-manager';
import {RelatedOverlay} from 'components/related-overlay/related-overlay';
import {PrePlaybackPlayOverlayWrapper} from 'components/pre-playback-play-overlay-wrapper/pre-playback-play-overlay-wrapper';
import {Next} from 'components/next/next';

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
    useContext: false
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
    this.init();
  }

  private init() {
    const {relatedManager} = this;
    relatedManager.load();

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

    this.player.ui.addComponent({
      label: 'kaltura-relayed-overlay-next',
      presets: PRESETS,
      area: 'OverlayPlaybackControls',
      get: () => <Next relatedManager={relatedManager} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-bottom-bar-next',
      presets: PRESETS,
      area: 'BottomBarPlaybackControls',
      get: () => <Next relatedManager={relatedManager} />
    });
  }
}

export {Related};
