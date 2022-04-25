import {ComponentChildren} from 'preact';
import {useState, useEffect, useReducer} from 'preact/hooks';
const {connect} = KalturaPlayer.ui.redux;

import {PageReducer} from './page-reducer';
import {PageAction} from './page-action';
import {ArrowLeft, ArrowRight} from 'components/pagination-arrow/pagination-arrow';

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
  const entriesPerPage = getPageSize(sizeBreakpoint);
  const getEntriesByPage = (page: number) => {
    const firstPageSize = entriesPerPage - 1;
    return data.slice(firstPageSize + (page - 1) * entriesPerPage, firstPageSize + page * entriesPerPage);
  };

  const arrowLeft =
    data.length > entriesPerPage - 1 ? (
      <div className={`${styles.arrow} ${styles.arrowLeft}`}>
        <ArrowLeft onClick={() => setPageAction(PageAction.PREV)} onEnter={() => setPageAction(PageAction.PREV)} disabled={currPage === 0} />
      </div>
    ) : (
      <></>
    );
  const arrowRight =
    data.length > entriesPerPage - 1 ? (
      <div className={`${styles.arrow} ${styles.arrowRight}`}>
        <ArrowRight
          onClick={() => setPageAction(PageAction.NEXT)}
          onEnter={() => setPageAction(PageAction.NEXT)}
          disabled={currPage > 0 && data.length <= nextPage * entriesPerPage}
        />
      </div>
    ) : (
      <></>
    );

  const entryDimensions = getExpandedEntryDimensions(sizeBreakpoint);

  if (currPage < 2) {
    return (
      <div className={getSizeClass(sizeBreakpoint, styles)}>
        {arrowLeft}
        <div className={`${styles.relatedGrid} ${pageAnimation}`} onAnimationEnd={onAnimationEnd}>
          <div className={`${styles.gridPages}`}>
            {currPage === 0 ? (
              <>
                <GridPage />
                <FirstPage {...{data, countdown, sizeBreakpoint, isActive: true}} />
                <GridPage>
                  <RelatedGridEntries
                    sizeBreakpoint={sizeBreakpoint}
                    data={getEntriesByPage(1)}
                    entriesPerPage={entriesPerPage}
                    entryDimensions={entryDimensions}
                  />
                </GridPage>
              </>
            ) : (
              <>
                <FirstPage {...{data, countdown, sizeBreakpoint}} />
                <GridPage isActive={true}>
                  <RelatedGridEntries
                    sizeBreakpoint={sizeBreakpoint}
                    data={getEntriesByPage(1)}
                    entriesPerPage={entriesPerPage}
                    entryDimensions={entryDimensions}
                  />
                </GridPage>
                <GridPage>
                  <RelatedGridEntries
                    sizeBreakpoint={sizeBreakpoint}
                    data={getEntriesByPage(2)}
                    entriesPerPage={entriesPerPage}
                    entryDimensions={entryDimensions}
                  />
                </GridPage>
              </>
            )}
          </div>
        </div>
        {arrowRight}
      </div>
    );
  }

  return (
    <div className={getSizeClass(sizeBreakpoint, styles)}>
      {arrowLeft}
      <div className={`${styles.relatedGrid} ${pageAnimation}`} onAnimationEnd={onAnimationEnd}>
        <div className={`${styles.gridPages}`}>
          <GridPage>
            <RelatedGridEntries
              sizeBreakpoint={sizeBreakpoint}
              data={getEntriesByPage(prevPage)}
              entriesPerPage={entriesPerPage}
              entryDimensions={entryDimensions}
            />
          </GridPage>
          <GridPage isActive={true}>
            <RelatedGridEntries
              sizeBreakpoint={sizeBreakpoint}
              data={getEntriesByPage(currPage)}
              entriesPerPage={entriesPerPage}
              entryDimensions={entryDimensions}
            />
          </GridPage>
          <GridPage>
            <RelatedGridEntries
              sizeBreakpoint={sizeBreakpoint}
              data={getEntriesByPage(nextPage)}
              entriesPerPage={entriesPerPage}
              entryDimensions={entryDimensions}
            />
          </GridPage>
        </div>
      </div>
      {arrowRight}
    </div>
  );
});

const GridPage = ({children, isActive = false}: {children?: ComponentChildren; isActive?: boolean}) =>
  isActive ? <div className={`${styles.gridPage} ${styles.active}`}>{children}</div> : <div className={`${styles.gridPage}`}>{children}</div>;

const FirstPage = ({
  data,
  countdown,
  sizeBreakpoint,
  isActive = false
}: {
  data: Sources[];
  countdown: number;
  sizeBreakpoint: string;
  isActive?: boolean;
}) => {
  const entryDimensions = getEntryDimensions(sizeBreakpoint);
  const pageSize = getPageSize(sizeBreakpoint);

  return (
    <GridPage isActive={isActive}>
      {getNextEntry(sizeBreakpoint, countdown, data[0])}
      <RelatedGridEntries
        sizeBreakpoint={sizeBreakpoint}
        data={data.slice(1, pageSize - 1)}
        entriesPerPage={pageSize - 2}
        entryDimensions={entryDimensions}
      />
    </GridPage>
  );
};

const RelatedGridEntries = ({
  sizeBreakpoint,
  data,
  entriesPerPage,
  entryDimensions
}: {
  sizeBreakpoint: string;
  data: Sources[];
  entriesPerPage: number;
  entryDimensions: EntryDimensions;
}) => {
  const entries = [];

  for (let i = 0; i < entriesPerPage; ++i) {
    const row = i % 2;
    const col = (i - row) / 2;

    const entryData = data[i];
    entries.push(
      <div tabIndex={0} className={`${styles.gridEntry} ${styles[`row${row}`]} ${styles[`col${col}`]}`}>
        {entryData ? getGridEntry(sizeBreakpoint, entryData, entryDimensions) : <></>}
      </div>
    );
  }

  return <div className={styles.relatedGridEntries}>{entries}</div>;
};

export {RelatedGrid};
