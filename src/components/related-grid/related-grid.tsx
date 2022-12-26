import {useState, useEffect, useReducer} from 'preact/hooks';
const {connect} = KalturaPlayer.ui.redux;

import {PageReducer} from './page-reducer';
import {PageAction} from './page-action';
import {ArrowLeft, ArrowLeftDisabled, ArrowRight, ArrowRightDisabled} from 'components/pagination-arrow/pagination-arrow';

import * as styles from './related-grid.scss';
import {Sources} from 'types/sources';
import {getEntryDimensions, getSizeClass, getNextEntry, getPageSize, getExpandedEntryDimensions, getGridEntry} from './grid-utils';
import {EntryDimensions} from 'types/entry-dimensions';

const mapStateToProps = (state: any) => {
  const {shell} = state;
  return {
    sizeBreakpoint: shell.playerSize
  };
};

interface RelatedGridProps {
  data: Sources[];
  countdown: number;
  sizeBreakpoint: string;
}

/**
 * grid component which displays related entries with pagination
 * the grid changes layout according to player size
 *
 * @param {object} props component props
 * @param {object} props.data related entries data
 * @param {number} props.countdown next entry auto continue countdown time
 * @param {string} props.sizeBreakpoint player size breakpoint
 * @returns {*} related grid component
 */
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
  const entriesPerPage = getPageSize(sizeBreakpoint);
  const getEntriesByPage = (page: number) => {
    const firstPageSize = entriesPerPage - 1;
    if (page < 0) {
      return [];
    } else if (page === 0) {
      return data.slice(0, firstPageSize);
    }
    return data.slice(firstPageSize + (page - 1) * entriesPerPage, firstPageSize + page * entriesPerPage);
  };

  const arrowLeft = (
    <div className={`${styles.arrow} ${styles.arrowLeft}`}>
      {currPage === 0 ? <ArrowLeftDisabled /> : <ArrowLeft onClick={() => setPageAction(PageAction.PREV)} />}
    </div>
  );

  const arrowRight = (
    <div className={`${styles.arrow} ${styles.arrowRight}`}>
      {currPage > 0 && data.length <= nextPage * entriesPerPage ? (
        <ArrowRightDisabled />
      ) : (
        <ArrowRight onClick={() => setPageAction(PageAction.NEXT)} />
      )}
    </div>
  );

  const firstPageEntryDimensions = getEntryDimensions(sizeBreakpoint);
  const entryDimensions = getExpandedEntryDimensions(sizeBreakpoint);

  return (
    <div className={getSizeClass(sizeBreakpoint, styles)}>
      {data.length > entriesPerPage - 1 ? arrowLeft : <></>}
      <div className={`${styles.relatedGrid} ${pageAnimation}`} onAnimationEnd={onAnimationEnd}>
        <div className={`${styles.gridPages}`}>
          <GridPage
            key={prevPage}
            isFirstPage={currPage === 1}
            countdown={countdown}
            sizeBreakpoint={sizeBreakpoint}
            data={getEntriesByPage(prevPage)}
            entryDimensions={currPage === 1 ? firstPageEntryDimensions : entryDimensions}
          />
          <GridPage
            key={currPage}
            isFirstPage={currPage === 0}
            isActive={true}
            countdown={countdown}
            sizeBreakpoint={sizeBreakpoint}
            data={getEntriesByPage(currPage)}
            entryDimensions={currPage === 0 ? firstPageEntryDimensions : entryDimensions}
          />
          <GridPage
            key={nextPage}
            sizeBreakpoint={sizeBreakpoint}
            countdown={countdown}
            data={getEntriesByPage(nextPage)}
            entryDimensions={entryDimensions}
          />
        </div>
      </div>
      {data.length > entriesPerPage - 1 ? arrowRight : <></>}
    </div>
  );
});

const GridPage = ({
  isFirstPage = false,
  isActive = false,
  entryDimensions,
  sizeBreakpoint,
  data,
  countdown
}: {
  isFirstPage?: boolean;
  isActive?: boolean;
  entryDimensions: EntryDimensions;
  sizeBreakpoint: string;
  countdown: number;
  data: Sources[];
}) => {
  if (!data.length) {
    return <div className={`${styles.gridPage} ${isActive ? styles.active : ''}`} />;
  }

  let nextEntry;
  if (isFirstPage) {
    nextEntry = getNextEntry(sizeBreakpoint, countdown, data[0]);
    data = data.slice(1);
  }

  const entries = [];

  for (let i = 0; i < data.length; ++i) {
    const row = i % 2;
    const col = (i - row) / 2;

    const entryData = data[i];
    entries.push(
      <div className={`${styles.gridEntry} ${styles[`row${row}`]} ${styles[`col${col}`]}`}>
        {entryData ? getGridEntry(sizeBreakpoint, entryData, entryDimensions) : <></>}
      </div>
    );
  }

  return (
    <div className={`${styles.gridPage} ${isActive ? styles.active : ''}`}>
      {nextEntry}
      <div className={styles.relatedGridEntries}>{entries}</div>
    </div>
  );
};

export {RelatedGrid};
