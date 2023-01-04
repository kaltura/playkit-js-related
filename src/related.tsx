import {ui} from 'kaltura-player-js';
const {SidePanelModes, SidePanelPositions} = ui;

import {RelatedManager} from 'related-manager';
import {Next, PrePlaybackPlayOverlayWrapper, RelatedList, RelatedOverlay, ListToggleButton, RelatedCountdownPreview} from 'components';
import {UpperBarManager, SidePanelsManager} from '@playkit-js/ui-managers';

import {Icon, RelatedConfig, RelatedEvent} from 'types';

const PRESETS = ['Playback', 'Live'];

/**
 * @class Related plugin.
 */
class Related extends KalturaPlayer.core.BasePlugin {
  /**
   * The default configuration of the plugin.
   *
   * @type {RelatedConfig}
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
    position: SidePanelPositions.RIGHT,
    expandMode: SidePanelModes.ALONGSIDE
  };
  /**
   * Related Manager instance.
   *
   * @private
   * @type {RelatedManager}
   * @memberof Related
   */
  private relatedManager: RelatedManager;
  /**
   * Id of the related list toggle icon, set using top bar manager.
   *
   * @private
   * @memberof Related
   */
  private iconId = -1;
  /**
   * Id of the related list side panel, set using side panel manager.
   *
   * @private
   * @memberof Related
   */
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
   * Creates an instance of Related plugin.
   *
   * @param {string} name Plugin name.
   * @param {KalturaPlayerTypes.Player} player Current kaltura player instance.
   * @param {RelatedConfig} config Related plugin configuation.
   * @memberof Related
   */
  constructor(name: string, player: KalturaPlayerTypes.Player, config: RelatedConfig) {
    super(name, player, config);
    this.relatedManager = new RelatedManager(this);
    this.injectUIComponents();
  }

  /**
   * Side panel manager service wrapper.
   *
   * @readonly
   * @private
   * @type {SidePanelsManager}
   * @memberof Related
   */
  private get sidePanelsManager(): SidePanelsManager {
    return (this.player.getService('sidePanelsManager') as SidePanelsManager) || {};
  }

  /**
   * Upper bar manager service wrapper.
   *
   * @readonly
   * @private
   * @type {UpperBarManager}
   * @memberof Related
   */
  private get upperBarManager(): UpperBarManager {
    return (this.player.getService('upperBarManager') as UpperBarManager) || {};
  }

  /**
   *
   * Inject related grid components into the player ui.
   *
   * @private
   * @memberof Related
   */
  private async injectUIComponents() {
    const {relatedManager} = this;

    this.player.ui.addComponent({
      label: 'kaltura-related-grid',
      presets: PRESETS,
      area: 'GuiArea',
      get: () => <RelatedOverlay {...{relatedManager}} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-pre-playback-play-overlay',
      presets: PRESETS,
      area: 'GuiArea',
      get: () => <PrePlaybackPlayOverlayWrapper {...{relatedManager}} />,
      replaceComponent: KalturaPlayer.ui.components.PrePlaybackPlayOverlay.displayName
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-overlay-next',
      presets: PRESETS,
      area: 'OverlayPlaybackControls',
      get: () => <Next {...{showPreview: false, onClick: () => relatedManager.playNext(), relatedManager}} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-bottom-bar-next',
      presets: PRESETS,
      area: 'BottomBarPlaybackControls',
      get: () => <Next {...{showPreview: true, onClick: () => relatedManager.playNext(), relatedManager}} />
    });

    this.player.ui.addComponent({
      label: 'kaltura-related-preview',
      presets: PRESETS,
      area: 'InteractiveArea',
      replaceComponent: 'PlaylistCountdown',
      get: () => <RelatedCountdownPreview {...{relatedManager}} />
    });
  }

  /**
   *
   * Player loadMedia callback.
   *
   * @memberof Related
   */
  async loadMedia() {
    const {config, relatedManager} = this;
    const {useContext, sourcesList, playlistId, entryList} = config;

    if (!relatedManager.isInitialized) {
      await relatedManager.load(config);
    } else if (playlistId || entryList?.length) {
      // do nothing
    } else if (!sourcesList?.length && useContext) {
      // refresh context entries
      await relatedManager.load(config);
    }

    await this.ready;

    this.addRelatedListComponents();
  }

  /**
   *
   * Inject related list panel and list toggle icon components into the ui.
   *
   * @memberof Related
   */
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
        return (
          <RelatedList
            relatedManager={this.relatedManager}
            isVertical={this.config?.position === SidePanelPositions.LEFT || this.config.position === SidePanelPositions.RIGHT}
          />
        );
      },
      presets: [ui.ReservedPresetNames.Playback],
      position: this.config.position,
      expandMode: this.config.expandMode
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
