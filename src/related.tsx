import { h } from "preact";
import EntryService from "services/entry-service";
import RelatedConfig from "./types/config";
import { RelatedOverlayWrapper } from "components/related-overlay/related-overlay";

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

  _entryService: EntryService;

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
    this._entryService = new EntryService(player);
    this.init();
  }

  async init() {
    const { playlistId, entryList } = this.config;
    let entries: KalturaPlayerTypes.Sources[] = [];

    if (playlistId) {
      entries = await this._entryService.getByPlaylistId(playlistId);
    } else if (entryList?.length) {
      entries = await this._entryService.getByEntryIds(entryList);
    }

    if (entries.length) {
      this.player.ui.addComponent({
        label: "kaltura-related-grid",
        presets: PRESETS,
        container: "GuiArea",
        // eslint-disable-next-line react/display-name
        get: () => {
          const props = {
            player: this.player,
            data: entries,
            toggleOnPlayPause: this.config.showOnPlaybackPaused
          };
          return <RelatedOverlayWrapper {...props} />;
        }
      });
    }
  }
}

export { Related };
