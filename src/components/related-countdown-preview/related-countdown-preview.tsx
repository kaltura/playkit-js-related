const {withEventManager} = KalturaPlayer.ui.Event;

import {useState, useEffect} from 'preact/hooks';

import {CloseButton, RelatedContext, Thumbnail, Countdown, MultilineText} from 'components';
import {RelatedManager} from 'related-manager';

import * as styles from './related-countdown-preview.scss';
import {RelatedInternalEvent} from 'event';

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
  eventManager: KalturaPlayerTypes.EventManager;
  eventContext: KalturaPlayerTypes.FakeEventTarget;
}

/**
 * Shows preview image of the next entry, with title and countdown.
 *
 * @param {object} props Component props.
 * @param {RelatedManager} props.relatedManager Related manager instance.
 * @param {boolean} props.isPlaybackEnded Handler for component loaded event.
 * @param {string} props.upNextIn Up next in label text.
 * @param {string} props.sizeBreakpoint Player size breakpoint.
 * @param {object} props.eventManager Component event manager.
 * @param {object} props.eventContext Event context.
 */
const RelatedCountdownPreview = withText({
  upNextIn: 'playlist.up_next_in'
})(
  withEventManager(
    connect(mapStateToProps)(({relatedManager, isPlaybackEnded, upNextIn, sizeBreakpoint, eventManager, eventContext}: RelatedCountdownProps) => {
      const [isVisible, setIsVisible] = useState(false);
      const [isListVisible, setIsListVisible] = useState(relatedManager.isListVisible);

      const [isAutoContinueCancelled, setIsAutoContinueCancelled] = useState(relatedManager.isAutoContinueCancelled);
      const showPreview = isPlaybackEnded && relatedManager.countdownTime > -1 && isListVisible && !isAutoContinueCancelled;

      useEffect(() => {
        eventManager.listen(eventContext, RelatedInternalEvent.LIST_VISIBILITY_CHANGED, ({payload}: {payload: boolean}) => {
          setIsListVisible(payload);
        });
        eventManager.listen(eventContext, RelatedInternalEvent.AUTO_CONTINUE_CANCELLED_CHANGED, ({payload}: {payload: boolean}) => {
          setIsAutoContinueCancelled(payload);
        });
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
          relatedManager.isAutoContinueCancelled = true;
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
  )
);

export {RelatedCountdownPreview};
