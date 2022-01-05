import RelatedConfig from "./types/config";
import RelatedManager from "related-manager";
import RelatedOverlay from "components/related-overlay/related-overlay";
import PrePlaybackPlayOverlayWrapper from "components/pre-playback-play-overlay-wrapper/pre-playback-play-overlay-wrapper";

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
    this.relatedManager = new RelatedManager(
      player,
      this.eventManager,
      this.config
    );
    this.init();
  }

  private async init() {
    const entriesLoaded = await this.relatedManager.load();
    if (entriesLoaded) {
      this.player.ui.addComponent({
        label: "kaltura-related-grid",
        presets: PRESETS,
        container: "GuiArea",
        get: () => {
          const props = {
            relatedManager: this.relatedManager
          };
          return <RelatedOverlay {...props} />;
        }
      });

      this.player.ui.addComponent({
        label: "kaltura-related-pre-playback-play-overlay",
        presets: PRESETS,
        container: "GuiArea",
        get: () => {
          return <PrePlaybackPlayOverlayWrapper />;
        },
        replaceComponent:
          KalturaPlayer.ui.components.PrePlaybackPlayOverlay.displayName
      });

      const { PrevNext } = KalturaPlayer.ui.components;
      const item = {
        relatedManager: this.relatedManager,
        get sources() {
          return this.relatedManager.entries[0];
        }
      };
      const prevNext = (
        <PrevNext
          type={"next"}
          item={item}
          onClick={() => {
            this.relatedManager.playNext();
          }}
        />
      );
      this.player.ui.addComponent({
        label: "kaltura-relayed-overlay-next",
        presets: PRESETS,
        container: "OverlayPlaybackControls",
        get: () => {
          return prevNext;
        }
      });
      this.player.ui.addComponent({
        label: "kaltura-related-bottom-bar-next",
        presets: PRESETS,
        container: "BottomBarPlaybackControls",
        get: () => {
          return prevNext;
        }
      });
    }
  }

  destroy() {
    // destroy event manager
    super.destroy();
  }
}

export { Related };
