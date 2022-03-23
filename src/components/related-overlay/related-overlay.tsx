import {RelatedContext} from 'components/related-context/related-context';
import {useState} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {RelatedGrid} from '../related-grid/related-grid';
import {getNextEntry} from '../related-grid/grid-utils';
import * as styles from './related-overlay.scss';

const {connect} = KalturaPlayer.ui.redux;
const {PLAYER_SIZE} = KalturaPlayer.ui.components;

const mapStateToProps = (state: any) => {
  const {engine, shell} = state;
  const {isPaused, isPlaybackEnded} = engine;
  return {
    isPaused,
    isPlaybackEnded,
    sizeBreakpoint: shell.playerSize
  };
};

interface RelatedOverlayProps {
  relatedManager: RelatedManager;
  isPaused: boolean;
  isPlaybackEnded: boolean;
  sizeBreakpoint: string;
}

const RelatedOverlay = connect(mapStateToProps)(({relatedManager, isPaused, isPlaybackEnded, sizeBreakpoint}: RelatedOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(-1);
  const [isHiddenByUser, setIsHiddenByUser] = useState(false);

  const onCancel = () => {
    setIsHiddenByUser(true);
    relatedManager.isHiddenByUser = true;
    setIsVisible(false);
  };

  if (!relatedManager.entries.length) {
    setIsVisible(false);
    setCountdown(-1);
    return <></>;
  } else if (!isPlaybackEnded) {
    setIsVisible(
      isPaused && relatedManager.showOnPlaybackPaused && sizeBreakpoint !== PLAYER_SIZE.EXTRA_SMALL && sizeBreakpoint !== PLAYER_SIZE.SMALL
    );
    setCountdown(-1);
  } else {
    setIsVisible(sizeBreakpoint !== PLAYER_SIZE.TINY && !isHiddenByUser);
    setCountdown(relatedManager.countdownTime);
  }

  return (
    <div>
      <div className={`${styles.relatedOverlay} ${isVisible ? '' : styles.hidden}`}>
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
  );
});

export {RelatedOverlay};
