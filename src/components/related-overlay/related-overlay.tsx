import {RelatedContext} from 'components/related-context/related-context';
import {useState} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {RelatedGrid} from '../related-grid/related-grid';
import {getNextEntry} from '../related-grid/grid-utils';
import * as styles from './related-overlay.scss';
import {ImageService} from 'services/image-service';

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
  imageService: ImageService;
  isPaused: boolean;
  isPlaybackEnded: boolean;
  sizeBreakpoint: string;
}

const RelatedOverlay = connect(mapStateToProps)(({relatedManager, imageService, isPaused, isPlaybackEnded, sizeBreakpoint}: RelatedOverlayProps) => {
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
        <RelatedContext.Provider value={{relatedManager, imageService}}>
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
