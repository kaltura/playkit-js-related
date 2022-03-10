import {RelatedContext} from 'components/related-context/related-context';
import {useState} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {RelatedGrid} from '../related-grid/related-grid';
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

  if (!relatedManager.entries.length || sizeBreakpoint === PLAYER_SIZE.TINY) {
    setIsVisible(false);
  } else if (!isPlaybackEnded) {
    setIsVisible(isPaused && relatedManager.showOnPlaybackPaused);
    setCountdown(-1);
  } else if (relatedManager.showOnPlaybackDone) {
    setIsVisible(true);
    setCountdown(relatedManager.countdownTime);
  } else {
    setIsVisible(false);
  }

  return (
    <div>
      <div className={`${styles.relatedOverlay} ${isVisible ? '' : styles.hidden}`}>
        <RelatedContext.Provider value={{relatedManager}}>
          <div className={styles.relatedContent}>
            <RelatedGrid data={relatedManager.entries} countdown={countdown} />
          </div>
        </RelatedContext.Provider>
      </div>
    </div>
  );
});

export {RelatedOverlay};
