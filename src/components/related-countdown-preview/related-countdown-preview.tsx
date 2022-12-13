import {useState, useEffect} from 'preact/hooks';

import {CloseButton, RelatedContext, Thumbnail} from 'components';
import {Countdown} from 'components/countdown/countdown';
import {MultilineText} from 'components/multiline-text/multiline-text';
import {RelatedManager} from 'related-manager';

import * as styles from './related-countdown-preview.scss';

const {connect} = KalturaPlayer.ui.redux;
const {withText} = KalturaPlayer.ui.preacti18n;

const mapStateToProps = (state: any) => {
  const {isPlaybackEnded} = state.engine;
  return {
    isPlaybackEnded
  };
};

interface RelatedCountdownProps {
  relatedManager: RelatedManager;
  isPlaybackEnded: boolean;
  upNextIn: string;
}

const RelatedCountdownPreview = withText({
  upNextIn: 'playlist.up_next_in'
})(
  connect(mapStateToProps)(({relatedManager, isPlaybackEnded, upNextIn}: RelatedCountdownProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (isPlaybackEnded && relatedManager.countdownTime > -1 && relatedManager.isListVisible && !relatedManager.isHiddenByUser) {
        setIsVisible(true);
        relatedManager?.playNext(relatedManager.countdownTime);
      }
    }, [isPlaybackEnded, relatedManager]);

    const onClose = (e: MouseEvent) => {
      relatedManager.clearNextEntryTimeout();
      relatedManager.isHiddenByUser = true;
      setIsVisible(false);
      e.stopPropagation();
    };

    if (isVisible) {
      const entryText = relatedManager.entries[0].metadata?.name;

      return (
        <RelatedContext.Provider value={{relatedManager}}>
          <div className={`${styles.relatedCountdownPreview} ${styles.animate}`} onClick={() => relatedManager.playNext()}>
            <Thumbnail poster={relatedManager.entries[0].poster} width={128} height={72} />
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
