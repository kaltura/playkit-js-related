import {useEffect, useState} from 'preact/hooks';
const {withText} = KalturaPlayer.ui.preacti18n;

const {Tooltip} = KalturaPlayer.ui.components;
import {RelatedManager} from 'related-manager';
import {RelatedEvent} from 'types';

import * as styles from './pre-playback-play-overlay-wrapper.scss';

const {PrePlaybackPlayOverlay, Icon, IconType, PLAYER_SIZE} = KalturaPlayer.ui.components;
const {connect} = KalturaPlayer.ui.redux;

const mapStateToProps = (state: any) => {
  const {isPlaybackEnded} = state.engine;
  const {isMobile, playerSize} = state.shell;
  const sizeBreakpoint = isMobile && playerSize !== PLAYER_SIZE.TINY ? PLAYER_SIZE.EXTRA_SMALL : playerSize;

  return {
    isPlaybackEnded,
    sizeBreakpoint
  };
};

interface PrePlaybackPlayOverlayWrapperProps {
  isPlaybackEnded: boolean;
  sizeBreakpoint: string;
  relatedManager: RelatedManager;
  onLoaded: (cb: (isHiddenByUser: boolean) => void) => void;
  onUnloaded: (cb: (isHiddenByUser: boolean) => void) => void;
  next: string;
  startOver: string;
}

/**
 * Overlay which is displayed on playback end instead of the default playback end overlay.
 *
 * @param {object} props Component props.
 * @param {boolean} props.isPlaybackEnded Indicates whether playback has ended.
 * @param {string} props.sizeBreakpoint Player size breakpoint.
 * @param {RelatedManager} props.relatedManager Related manager instance.
 * @param {Function} props.onLoaded Handler for component loaded event.
 * @param {Function} props.onUnloaded Handler for component unloaded event.
 * @param {string} props.next Next label text.
 * @param {string} props.startOver Start over label text.
 */
const PrePlaybackPlayOverlayWrapper = withText({
  next: 'playlist.next',
  startOver: 'controls.startOver'
})(
  connect(mapStateToProps)(({isPlaybackEnded, sizeBreakpoint, relatedManager, next, startOver}: PrePlaybackPlayOverlayWrapperProps) => {
    const [isHiddenByUser, setIsHiddenByUser] = useState(false);

    useEffect(() => {
      function onHiddenStateChanged({payload}: {payload: boolean}) {
        setIsHiddenByUser(payload);
      }

      relatedManager.listen(RelatedEvent.HIDDEN_STATE_CHANGED, onHiddenStateChanged);

      return () => {
        relatedManager.unlisten(RelatedEvent.HIDDEN_STATE_CHANGED, onHiddenStateChanged);
      };
    }, []);

    if (!isPlaybackEnded) return <PrePlaybackPlayOverlay />;
    else if (isHiddenByUser && (sizeBreakpoint === PLAYER_SIZE.SMALL || sizeBreakpoint === PLAYER_SIZE.EXTRA_SMALL)) {
      return (
        <div className={styles.minimalPrePlaybackPlayOverlay}>
          <div className={styles.buttonContainer}>
            <Tooltip label={startOver}>
              <button tabIndex={0} aria-label={startOver} className={styles.prePlaybackPlayButton} onClick={() => relatedManager.startOver()}>
                <Icon type={IconType.StartOver} />
              </button>
            </Tooltip>
            <Tooltip label={next}>
              <button tabIndex={0} aria-label={next} className={styles.prePlaybackPlayButton} onClick={() => relatedManager.playNext()}>
                <Icon type={IconType.Next} />
              </button>
            </Tooltip>
            <div />
          </div>
        </div>
      );
    }
    return <></>;
  })
);

export {PrePlaybackPlayOverlayWrapper};
