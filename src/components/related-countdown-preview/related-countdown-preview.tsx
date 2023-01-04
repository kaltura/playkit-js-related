import {useState, useEffect} from 'preact/hooks';

import {CloseButton, RelatedContext, Thumbnail, Countdown, MultilineText} from 'components';
import {RelatedManager} from 'related-manager';

import * as styles from './related-countdown-preview.scss';
import {RelatedEvent} from 'types';

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
 * Shows preview image of the next entry, with title and countdown.
 */
const RelatedCountdownPreview = withText({
  upNextIn: 'playlist.up_next_in'
})(
  connect(mapStateToProps)(({relatedManager, isPlaybackEnded, upNextIn, sizeBreakpoint}: RelatedCountdownProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isListVisible, setIsListVisible] = useState(relatedManager.isListVisible);
    const [isHiddenByUser, setIsHiddenByUser] = useState(relatedManager.isHiddenByUser);

    const showPreview = isPlaybackEnded && relatedManager.countdownTime > -1 && isListVisible && !isHiddenByUser;

    useEffect(() => {
      function onListVisibilityChanged({payload}: {payload: boolean}) {
        setIsListVisible(payload);
      }

      function onHiddenStateChanged({payload}: {payload: boolean}) {
        setIsHiddenByUser(payload);
      }

      relatedManager.listen(RelatedEvent.LIST_VISIBILITY_CHANGED, onListVisibilityChanged);
      relatedManager.listen(RelatedEvent.HIDDEN_STATE_CHANGED, onHiddenStateChanged);

      return () => {
        relatedManager.unlisten(RelatedEvent.LIST_VISIBILITY_CHANGED, onListVisibilityChanged);
        relatedManager.unlisten(RelatedEvent.HIDDEN_STATE_CHANGED, onHiddenStateChanged);
      };
    }, []);

    useEffect(() => {
      if (showPreview) {
        relatedManager.getImageUrl(relatedManager.entries[1]?.poster || '').then(() => {
          setIsVisible(true);
          relatedManager?.playNext(relatedManager.countdownTime);
        });
      }
    }, [relatedManager, showPreview]);

    if (showPreview && isVisible && sizeBreakpoint !== PLAYER_SIZE.TINY) {
      const entryText = relatedManager.entries[1]?.metadata?.name;
      const isMinimal = [PLAYER_SIZE.EXTRA_SMALL, PLAYER_SIZE.SMALL].includes(sizeBreakpoint);

      const onClose = (e: MouseEvent) => {
        relatedManager.clearNextEntryTimeout();
        relatedManager.isHiddenByUser = true;
        setIsVisible(false);
        e.stopPropagation();
      };

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
