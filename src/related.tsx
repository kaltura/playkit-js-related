import { h } from "preact";

import RelatedConfig from "./types/config";
import RelatedGrid from "./components/related-grid/related-grid";
import { EntryListItem, EntryListResponse } from "./types/entry-list-response";

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
    showOnPlaybackPaused: false,
    relatedEntriesSource: {
      entryList: [],
    },
  };

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

    // get entries by playlist id
    const { playlistId, entryList } = this.config;
    if (playlistId) {
      this.getEntriesByPlaylistId(playlistId);
    } else if (entryList?.length) {
      this.getEntries(entryList);
    }
  }

  getEntriesByPlaylistId(playlistId: string): void {
    this.player.provider
      .getPlaylistConfig({ playlistId })
      .then((playlistData: any) => {
        console.log(playlistData);
        //this.addControls();
      })
      .catch(() => {
        //const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
        //this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
      });
  }

  getEntries(entryList: Array<string>): void {
    const entries = entryList.map((entryId) => {
      return { entryId };
    });
    this.player.provider
      .getEntryListConfig({ entries })
      .then((entryListReponse: EntryListResponse) => {
        console.log(entryListReponse);
        if (entryListReponse.items.length) {
          const entries = entryListReponse.items.map(
            (entryListItem: EntryListItem) => entryListItem.sources
          );
          this.addControls(entries);
        }
      })
      .catch(() => {
        //const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
        //this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
      });
  }

  addControls(items: Array<KalturaPlayerTypes.Sources>): void {
    this.player.ui.addComponent({
      label: "kaltura-related-grid",
      presets: PRESETS,
      container: "GuiArea",
      get: () => <RelatedGrid items={items} />,
    });
  }

  toggleGrid(): void {
    // TODO show/hide grid
  }
}

export { Related };
