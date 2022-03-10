import {ComponentChildren} from 'preact';
import {useState, useEffect, useReducer} from 'preact/hooks';
const {connect} = KalturaPlayer.ui.redux;
const {PLAYER_SIZE} = KalturaPlayer.ui.components;

import {RelatedGridEntries} from 'components/related-grid/related-grid-entries';
import {NextEntry} from 'components/entry/next-entry';
import {PageReducer} from './page-reducer';
import {PageAction} from './page-action';
import {ArrowLeft, ArrowRight} from 'components/pagination-arrow/pagination-arrow';

import * as styles from './related-grid.scss';
import {Sources} from 'types/sources';

const mapStateToProps = (state: any) => {
  const {shell} = state;
  return {
    sizeBreakpoint: shell.playerSize
  };
};

interface RelatedGridProps {
  data: Sources[];
  pages: number[];
  countdown: number;
  sizeBreakpoint: string;
}

const RelatedGrid = connect(mapStateToProps)(({data, countdown, sizeBreakpoint}: RelatedGridProps) => {
  if (!data.length) return <></>;

  const onAnimationEnd = () => {
    if (pageAction !== PageAction.NOTHING) {
      dispatch(pageAction);
      setPageAnimation('');
      setPageAction(PageAction.NOTHING);
    }
  };

  const [pageState, dispatch] = useReducer(PageReducer, {
    prevPage: -1,
    currPage: 0,
    nextPage: 1
  });
  const {prevPage, currPage, nextPage} = pageState;
  const [pageAction, setPageAction] = useState(PageAction.NOTHING);
  const [pageAnimation, setPageAnimation] = useState('');

  useEffect(() => {
    if (pageAction !== PageAction.NOTHING) {
      setPageAnimation(pageAction === PageAction.NEXT ? styles.slideLeft : styles.slideRight);
    }
  }, [pageAction]);
  const entriesPerPage = getEntriesPerPage(sizeBreakpoint);
  const getEntriesByPage = (page: number) => {
    return data.slice(page * (entriesPerPage - 1), 1 + (page + 1) * entriesPerPage);
  };

  const arrowLeft =
    data.length > entriesPerPage - 1 ? (
      <div className={`${styles.arrow} ${styles.arrowLeft}`}>
        <ArrowLeft onClick={() => setPageAction(PageAction.PREV)} disabled={currPage === 0} />
      </div>
    ) : (
      <></>
    );
  const arrowRight =
    data.length > entriesPerPage - 1 ? (
      <div className={`${styles.arrow} ${styles.arrowRight}`}>
        <ArrowRight onClick={() => setPageAction(PageAction.NEXT)} disabled={currPage > 0 && data.length <= nextPage * entriesPerPage} />
      </div>
    ) : (
      <></>
    );

  if (currPage < 2) {
    return (
      <>
        {arrowLeft}
        <div className={`${styles.relatedGrid} ${pageAnimation} ${getPagesSizeClass(sizeBreakpoint)}`} onAnimationEnd={onAnimationEnd}>
          <div className={`${styles.gridPages}`}>
            {currPage === 0 ? (
              <>
                <GridPage />
                <FirstPage data={data} entriesPerPage={entriesPerPage} countdown={countdown} />
                <GridPage>
                  <RelatedGridEntries data={getEntriesByPage(1)} entriesPerPage={entriesPerPage} />
                </GridPage>
              </>
            ) : (
              <>
                <FirstPage data={data} entriesPerPage={entriesPerPage} countdown={countdown} />
                <GridPage>
                  <RelatedGridEntries data={getEntriesByPage(1)} entriesPerPage={entriesPerPage} />
                </GridPage>
                <GridPage>
                  <RelatedGridEntries data={getEntriesByPage(2)} entriesPerPage={entriesPerPage} />
                </GridPage>
              </>
            )}
          </div>
        </div>
        {arrowRight}
      </>
    );
  }

  return (
    <>
      {arrowLeft}
      <div className={`${styles.relatedGrid} ${pageAnimation} ${getPagesSizeClass(sizeBreakpoint)}`} onAnimationEnd={onAnimationEnd}>
        <div className={`${styles.gridPages}`}>
          <GridPage>
            <RelatedGridEntries data={getEntriesByPage(prevPage)} entriesPerPage={entriesPerPage} />
          </GridPage>
          <GridPage>
            <RelatedGridEntries data={getEntriesByPage(currPage)} entriesPerPage={entriesPerPage} />
          </GridPage>
          <GridPage>
            <RelatedGridEntries data={getEntriesByPage(nextPage)} entriesPerPage={entriesPerPage} />
          </GridPage>
        </div>
      </div>
      {arrowRight}
    </>
  );
});

const getPagesSizeClass = (sizeBreakpoint: string) => {
  return sizeBreakpoint === PLAYER_SIZE.LARGE ? styles.large : styles.extraLarge;
};

const getEntriesPerPage = (sizeBreakpoint: string) => {
  switch (sizeBreakpoint) {
    // case PLAYER_SIZE.MEDIUM: {
    //   // 4 per page + different shape
    //   break;
    // }
    case PLAYER_SIZE.LARGE: {
      return 6;
    }
    case PLAYER_SIZE.EXTRA_LARGE: {
      return 8;
    }
  }
  return 0;
};

const GridPage = ({children}: {children?: ComponentChildren}) => <div className={`${styles.gridPage} `}>{children}</div>;
const FirstPage = ({data, entriesPerPage, countdown}: {data: Sources[]; entriesPerPage: number; countdown: number}) => (
  <GridPage>
    <NextEntry
      id={data[0].internalIndex}
      key={data[0].internalIndex}
      duration={data[0].duration}
      type={data[0].type}
      imageUrl={data[0].poster}
      width={260}
      imageHeight={147}
      contentHeight={163}
      title={data[0].metadata?.name}
      description={data[0].metadata?.description}
      countdown={countdown}
    />
    <RelatedGridEntries data={data.slice(1, entriesPerPage - 1)} entriesPerPage={entriesPerPage} isExpanded={false} />
  </GridPage>
);
export {RelatedGrid};
