import {ArrowLeft, ArrowRight} from 'components/pagination-arrow/pagination-arrow';
import {RelatedContext} from 'components/related-context/related-context';
import {useState, useReducer, useEffect} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {GridPages} from './grid-pages';
import {PageAction} from './page-action';
import * as styles from './related-overlay.scss';

const {connect} = KalturaPlayer.ui.redux;

const FIRST_PAGE_ENTRIES_NUM = 7;
const PAGE_ENTRIES_NUM = 8;

const pageReducer = (state: {prevPage: number; currPage: number; nextPage: number}, action: PageAction) => {
  const {prevPage, currPage, nextPage} = state;
  const offset = action === PageAction.NEXT ? 1 : -1;
  return {
    prevPage: prevPage + offset,
    currPage: currPage + offset,
    nextPage: nextPage + offset
  };
};

const mapStateToProps = (state: any) => {
  return {
    isPaused: state.engine.isPaused,
    isPlaybackEnded: state.engine.isPlaybackEnded
  };
};

const RelatedOverlay = connect(mapStateToProps)(
  ({relatedManager, isPaused, isPlaybackEnded}: {relatedManager: RelatedManager; isPaused: boolean; isPlaybackEnded: boolean}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [countdown, setCountdown] = useState(-1);
    const [pageAnimation, setPageAnimation] = useState('');
    const [pageAction, setPageAction] = useState(PageAction.NOTHING);

    const [pageState, dispatch] = useReducer(pageReducer, {
      prevPage: -1,
      currPage: 0,
      nextPage: 1
    });

    useEffect(() => {
      if (pageAction !== PageAction.NOTHING) {
        setPageAnimation(pageAction === PageAction.NEXT ? styles.slideLeft : styles.slideRight);
      }
    }, [pageAction]);

    const onAnimationEnd = () => {
      if (pageAction !== PageAction.NOTHING) {
        dispatch(pageAction);
        setPageAnimation('');
        setPageAction(PageAction.NOTHING);
      }
    };

    if (!relatedManager.entries.length) {
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

    const {entries} = relatedManager;

    const showPagination = relatedManager.entries.length > FIRST_PAGE_ENTRIES_NUM;
    const {prevPage, currPage, nextPage} = pageState;

    return (
      <div className={`${styles.relatedOverlay} ${isVisible ? '' : styles.hidden}`}>
        <RelatedContext.Provider value={{relatedManager}}>
          <div className={styles.content}>
            {showPagination ? (
              <>
                <div className={styles.arrowRight}>
                  <ArrowRight onClick={() => setPageAction(PageAction.PREV)} disabled={currPage === 0} />
                </div>
                <div className={styles.arrowLeft}>
                  <ArrowLeft
                    onClick={() => setPageAction(PageAction.NEXT)}
                    disabled={currPage > 0 && entries.length <= nextPage * PAGE_ENTRIES_NUM}
                  />
                </div>
              </>
            ) : undefined}

            <div className={`${styles.gridPagesWrapper} ${pageAnimation}`} onAnimationEnd={onAnimationEnd}>
              <GridPages data={relatedManager.entries} countdown={countdown} prevPage={prevPage} currPage={currPage} nextPage={nextPage} />
            </div>
          </div>
        </RelatedContext.Provider>
      </div>
    );
  }
);

export {RelatedOverlay};
