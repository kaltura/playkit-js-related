import RelatedConfig from "./types/config";
import RelatedManager from "related-manager";
import RelatedOverlay from "components/related-overlay/related-overlay";

const PRESETS = ["Playback", "Live", "Ads"];

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
    showOnPlaybackPaused: false
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
  constructor(
    name: string,
    player: KalturaPlayerTypes.Player,
    config: RelatedConfig
  ) {
    super(name, player, config);
    this.relatedManager = new RelatedManager(player, config);
    this.init();
  }

  async init() {
    const entriesLoaded = await this.relatedManager.load();
    if (entriesLoaded) {
      this.relatedManager.init();
      this.player.ui.addComponent({
        label: "kaltura-related-grid",
        presets: PRESETS,
        container: "GuiArea",
        // eslint-disable-next-line react/display-name
        get: () => {
          const props = {
            relatedManager: this.relatedManager
          };
          return <RelatedOverlay {...props} />;
        }
      });
    }
  }
}

export { Related };
