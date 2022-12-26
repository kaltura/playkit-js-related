import {useEffect, useState} from 'preact/hooks';
const {withText} = KalturaPlayer.ui.preacti18n;

const {Tooltip} = KalturaPlayer.ui.components;
import {RelatedManager} from 'related-manager';

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
 * related entries overlay to be shown on playback end instead of the default playback end overlay
 *
 * @param {object} props component props
 * @param {boolean} isPlaybackEnded indicates whether playback has ended
 * @param {string} props.sizeBreakpoint current player size breakpoint
 * @param {RelatedManager} props.relatedManager related manager instance
 * @param {Function} props.onLoaded on loaded callback
 * @param {Function} props.onUnloaded on unloaded callback
 * @param {string} props.next next label text
 * @param {string} props.startOver start over label text
 * @returns {*} pre playback play overlay component
 */
const PrePlaybackPlayOverlayWrapper = withText({
  next: 'playlist.next',
  startOver: 'controls.startOver'
})(
  connect(mapStateToProps)(
    ({isPlaybackEnded, sizeBreakpoint, relatedManager, onLoaded, onUnloaded, next, startOver}: PrePlaybackPlayOverlayWrapperProps) => {
      const [isHiddenByUser, setIsHiddenByUser] = useState(false);

      useEffect(() => {
        /**
         * callback for grid / list auto continue being manually cancelled by user
         *
         * @param {boolean} isHiddenByUser whether auto continue was cancelled
         */
        function onHiddenStateChanged(isHiddenByUser: boolean) {
          setIsHiddenByUser(isHiddenByUser);
        }

        onLoaded(onHiddenStateChanged);

        return () => {
          // clear listener on component unmount
          onUnloaded(onHiddenStateChanged);
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
    }
  )
);

export {PrePlaybackPlayOverlayWrapper};
