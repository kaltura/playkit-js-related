import {RelatedContext} from 'components/related-context/related-context';
import {useState, useEffect} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {RelatedGrid} from '../related-grid/related-grid';
import {getNextEntry} from '../related-grid/grid-utils';

import * as styles from './related-overlay.scss';

const {connect} = KalturaPlayer.ui.redux;
const {PLAYER_SIZE} = KalturaPlayer.ui.components;

const mapStateToProps = (state: any) => {
  const {isPaused, isPlaybackEnded} = state.engine;
  const {isMobile, playerSize} = state.shell;
  const sizeBreakpoint = isMobile && playerSize !== PLAYER_SIZE.TINY ? PLAYER_SIZE.EXTRA_SMALL : playerSize;

  return {
    isPaused,
    isPlaybackEnded,
    sizeBreakpoint
  };
};

interface RelatedOverlayProps {
  relatedManager: RelatedManager;
  isPaused: boolean;
  isPlaybackEnded: boolean;
  sizeBreakpoint: string;
}

/**
 * related overlay which contains the related grid and controls its layout and visibility
 *
 * @param {object} props component props
 * @param {RelatedManager} props.relatedManager related manager instance
 * @param {boolean} props.isPaused indicates whether playback is paused
 * @param {boolean} props.isPlaybackEnded indicates whether playback has ended
 * @param {string} props.sizeBreakpoint player size breakpoint
 * @returns {*} related overlay component
 */
const RelatedOverlay = connect(mapStateToProps)(({relatedManager, isPaused, isPlaybackEnded, sizeBreakpoint}: RelatedOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(-1);
  const [isHiddenByUser, setIsHiddenByUser] = useState(false);

  useEffect(() => {
    relatedManager.isGridVisible = isVisible;
  }, [relatedManager, isVisible]);

  const onCancel = () => {
    setIsHiddenByUser(true);
    relatedManager.isHiddenByUser = true;
    setIsVisible(false);
  };

  if (!relatedManager.entries.length || relatedManager.isListVisible) {
    setIsVisible(false);
    setCountdown(-1);
    return <></>;
  } else if (!isPlaybackEnded) {
    setIsVisible(
      isPaused && relatedManager.showOnPlaybackPaused && ![PLAYER_SIZE.TINY, PLAYER_SIZE.EXTRA_SMALL, PLAYER_SIZE.SMALL].includes(sizeBreakpoint)
    );
    setCountdown(-1);
  } else {
    setIsVisible(sizeBreakpoint !== PLAYER_SIZE.TINY && !isHiddenByUser);
    setCountdown(relatedManager.countdownTime);
  }

  return isVisible ? (
    <div>
      <div className={styles.relatedOverlay}>
        <RelatedContext.Provider value={{relatedManager}}>
          <div className={styles.relatedContent}>
            {sizeBreakpoint === PLAYER_SIZE.EXTRA_SMALL || sizeBreakpoint === PLAYER_SIZE.SMALL ? (
              getNextEntry(sizeBreakpoint, countdown, relatedManager.entries[0], onCancel)
            ) : (
              <RelatedGrid data={relatedManager.entries} countdown={countdown} />
            )}
          </div>
        </RelatedContext.Provider>
      </div>
    </div>
  ) : (
    <></>
  );
});

export {RelatedOverlay};
