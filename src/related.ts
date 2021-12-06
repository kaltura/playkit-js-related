import { RelatedConfig } from "./config";

/**
* ExamplePlugin class.
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
            entryList: []
        }
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
    constructor(name: string, player: any, config: RelatedConfig) {
        super(name, player, config);

        // get entries by playlist id
        const { playlistId, entryList } = this.config;
        if (playlistId) {
            this.getEntriesByPlaylistId(playlistId);
        } else if (entryList?.length) {
            this.getEntries(entryList);
        }
    }

    getEntriesByPlaylistId(playlistId: string) {
        this.player.provider.getPlaylistConfig({ playlistId }).then(
            (playlistData: any) => {
                console.log(playlistData);
            })
            .catch(() => {
                //const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
                //this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
            });
    }

    getEntries(entryList: Array<string>): void {
        const entries = entryList.map((entryId) => { return {entryId}; });
        this.player.provider.getEntryListConfig({ entries }).then((entryListData: any) => {
            console.log(entryListData);
        })
        .catch(() => {
            //const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
            //this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
        });
    }
}

export { Related };
