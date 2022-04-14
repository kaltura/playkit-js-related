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

const PrePlaybackPlayOverlayWrapper = withText({
  next: 'playlist.next',
  startOver: 'controls.startOver'
})(
  connect(mapStateToProps)(
    ({isPlaybackEnded, sizeBreakpoint, relatedManager, onLoaded, onUnloaded, next, startOver}: PrePlaybackPlayOverlayWrapperProps) => {
      const [isHiddenByUser, setIsHiddenByUser] = useState(false);

      useEffect(() => {
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
                <button className={styles.prePlaybackPlayButton} onClick={() => relatedManager.startOver()}>
                  <Icon type={IconType.StartOver} />
                </button>
              </Tooltip>
              <Tooltip label={next}>
                <button className={styles.prePlaybackPlayButton} onClick={() => relatedManager.playNext()}>
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
