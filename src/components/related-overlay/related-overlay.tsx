import {NextEntryPreview} from 'components/next-entry-preview/next-entry-preview';
import {RelatedContext} from 'components/related-context/related-context';
import {useState} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {Sources} from 'types/sources';
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

  if (!relatedManager.entries.length) {
    setIsVisible(false);
    setCountdown(-1);
  } else if (!isPlaybackEnded) {
    setIsVisible(
      isPaused && relatedManager.showOnPlaybackPaused
      // && sizeBreakpoint !== PLAYER_SIZE.EXTRA_SMALL && sizeBreakpoint !== PLAYER_SIZE.SMALL
    );
    setCountdown(-1);
  } else if (relatedManager.showOnPlaybackDone) {
    setIsVisible(sizeBreakpoint !== PLAYER_SIZE.TINY);
    setCountdown(relatedManager.countdownTime);
  } else {
    setIsVisible(false);
  }

  return (
    <div>
      <div className={`${styles.relatedOverlay} ${isVisible ? '' : styles.hidden}`}>
        <RelatedContext.Provider value={{relatedManager}}>
          <div className={styles.relatedContent}>
            <RelatedContent entries={relatedManager.entries} countdown={countdown} sizeBreakpoint={sizeBreakpoint} />
          </div>
        </RelatedContext.Provider>
      </div>
    </div>
  );
});

const RelatedContent = ({entries, countdown, sizeBreakpoint}: {entries: Sources[]; countdown: number; sizeBreakpoint: string}) => {
  if (!entries.length) return <></>;

  switch (sizeBreakpoint) {
    case PLAYER_SIZE.EXTRA_SMALL:
    case PLAYER_SIZE.SMALL: {
      return <NextEntryPreview data={entries[0]} countdown={countdown} />;
    }
    default:
      return <RelatedGrid data={entries} countdown={countdown} />;
  }
};

export {RelatedOverlay};
