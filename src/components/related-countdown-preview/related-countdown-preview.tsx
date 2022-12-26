import {useState, useEffect} from 'preact/hooks';

import {CloseButton, RelatedContext, Thumbnail, Countdown, MultilineText} from 'components';
import {RelatedManager} from 'related-manager';

import * as styles from './related-countdown-preview.scss';

const {connect} = KalturaPlayer.ui.redux;
const {withText} = KalturaPlayer.ui.preacti18n;
const {PLAYER_SIZE} = KalturaPlayer.ui.components;

const mapStateToProps = (state: any) => {
  const {isPlaybackEnded} = state.engine;
  const {isMobile, playerSize} = state.shell;

  const sizeBreakpoint = isMobile && playerSize !== PLAYER_SIZE.TINY ? PLAYER_SIZE.EXTRA_SMALL : playerSize;

  return {
    isPlaybackEnded,
    sizeBreakpoint
  };
};

interface RelatedCountdownProps {
  relatedManager: RelatedManager;
  isPlaybackEnded: boolean;
  upNextIn: string;
  sizeBreakpoint: string;
}

/**
 * @returns {*} component for next entry preview
 */
const RelatedCountdownPreview = withText({
  upNextIn: 'playlist.up_next_in'
})(
  connect(mapStateToProps)(({relatedManager, isPlaybackEnded, upNextIn, sizeBreakpoint}: RelatedCountdownProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (isPlaybackEnded && relatedManager.countdownTime > -1 && relatedManager.isListVisible && !relatedManager.isHiddenByUser) {
        relatedManager.getImageUrl(relatedManager.entries[1]?.poster || '').then(() => {
          setIsVisible(true);
          relatedManager?.playNext(relatedManager.countdownTime);
        });
      } else {
        setIsVisible(false);
      }
    }, [isPlaybackEnded, relatedManager]);

    const onClose = (e: MouseEvent) => {
      relatedManager.clearNextEntryTimeout();
      relatedManager.isHiddenByUser = true;
      setIsVisible(false);
      e.stopPropagation();
    };

    if (isVisible && sizeBreakpoint !== PLAYER_SIZE.TINY) {
      const entryText = relatedManager.entries[1]?.metadata?.name;
      const isMinimal = [PLAYER_SIZE.EXTRA_SMALL, PLAYER_SIZE.SMALL].includes(sizeBreakpoint);

      return (
        <RelatedContext.Provider value={{relatedManager}}>
          <div className={`${styles.relatedCountdownPreview} ${isMinimal ? styles.minimal : ''}`} onClick={() => relatedManager.playNext()}>
            {isMinimal ? <></> : <Thumbnail poster={relatedManager.entries[1]?.poster} width={128} height={72} />}
            <div className={styles.content}>
              <div className={styles.header}>
                <span>
                  {`${upNextIn} `}
                  <Countdown seconds={relatedManager.countdownTime} />
                </span>
                <span className={styles.closeButton}>
                  <CloseButton onClick={onClose} />
                </span>
              </div>
              <div className={styles.entryText}>{entryText ? <MultilineText text={entryText} lineHeight={18} lines={2} /> : <></>}</div>
            </div>
          </div>
        </RelatedContext.Provider>
      );
    }
  })
);

export {RelatedCountdownPreview};
