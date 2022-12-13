import {ui} from 'kaltura-player-js';

import {RelatedManager} from 'related-manager';
import {Next, PrePlaybackPlayOverlayWrapper, RelatedList, RelatedOverlay, ListToggleButton, RelatedCountdownPreview} from 'components';
import {UpperBarManager, SidePanelsManager} from '@playkit-js/ui-managers';

import {Icon, RelatedConfig, RelatedEvent} from 'types';

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
  private iconId = -1;
  private panelId = -1;

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

  private get sidePanelsManager() {
    return (this.player.getService('sidePanelsManager') as SidePanelsManager) || {};
  }

  private get upperBarManager() {
    return (this.player.getService('upperBarManager') as UpperBarManager) || {};
  }

  private async injectUIComponents() {
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
      get: () => <Next {...{...nextProps, showPreview: false}} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-bottom-bar-next',
      presets: PRESETS,
      area: 'BottomBarPlaybackControls',
      get: () => <Next {...{...nextProps, showPreview: true}} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-preview',
      presets: PRESETS,
      area: 'InteractiveArea',
      replaceComponent: 'PlaylistCountdown',
      get: () => <RelatedCountdownPreview relatedManager={this.relatedManager} />
    });
  }

  async loadMedia() {
    const {ks, config, relatedManager} = this;
    const {useContext, playlistId, entryList, sourcesList} = config;
    const newKs = this.config?.ks;

    if (!relatedManager.isInitialized) {
      await relatedManager.load(config, newKs);
    } else if (playlistId || entryList?.length) {
      if (ks && ks !== newKs) {
        this.logger.info('ks changed - reloading related entries');
        await relatedManager.load(config, newKs);
      }
    } else if (!sourcesList?.length && useContext) {
      // refresh context entries
      await relatedManager.load(config, newKs);
    }

    await this.ready;

    this.addRelatedListComponents();
  }

  addRelatedListComponents() {
    if (this.iconId > 0 || !this.relatedManager.entries.length) return;

    this.iconId = this.upperBarManager.add({
      label: 'Related',
      svgIcon: {
        viewBox: '0 0 32 32',
        path: Icon.LIST_TOGGLE
      },
      onClick: () => {
        if (!this.relatedManager.isGridVisible) {
          this.relatedManager.isListVisible = !this.relatedManager.isListVisible;
        }
      },
      component: () => {
        return <ListToggleButton active={this.relatedManager.isListVisible} disabled={this.relatedManager.isGridVisible} />;
      }
    }) as number;

    this.panelId = this.sidePanelsManager.add({
      label: 'Related',
      panelComponent: () => {
        return <RelatedList relatedManager={this.relatedManager} />;
      },
      presets: [ui.ReservedPresetNames.Playback],
      position: 'right',
      expandMode: 'over'
    }) as number;

    this.relatedManager.listen(RelatedEvent.GRID_VISIBILITY_CHANGED, () => {
      this.upperBarManager?.update(this.iconId);
    });

    this.relatedManager.listen(RelatedEvent.LIST_VISIBILITY_CHANGED, () => {
      this.upperBarManager?.update(this.iconId);
      this.sidePanelsManager[this.relatedManager.isListVisible ? 'activateItem' : 'deactivateItem'](this.panelId);
    });
  }

  reset() {
    this.eventManager.removeAll();
    this.upperBarManager?.remove(this.iconId);
    this.sidePanelsManager?.remove(this.panelId);
    this.relatedManager.isListVisible = false;
    this.relatedManager.isGridVisible = false;
    this.relatedManager.isHiddenByUser = false;
    this.iconId = -1;
    this.panelId = -1;
  }
}

export {Related};
