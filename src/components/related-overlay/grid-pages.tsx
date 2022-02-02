import {RelatedGrid} from 'components/related-grid/related-grid';
import {NextEntry} from 'components/entry/next-entry';

import * as styles from './related-overlay.scss';

const GridPages = ({
  data,
  countdown,
  prevPage,
  currPage,
  nextPage
}: {
  data: KalturaPlayerTypes.Sources[];
  countdown: number;
  prevPage: number;
  currPage: number;
  nextPage: number;
}) => {
  const getEntriesByPage = (page: number) => {
    const pageStart = page * 7;
    return data.slice(pageStart, pageStart + 8);
  };

  if (!data.length) return <></>;

  const firstEntryData = data[0];
  const firstEntry = (
    <NextEntry
      id={firstEntryData.id}
      key={firstEntryData.id}
      duration={firstEntryData.duration}
      imageUrl={firstEntryData.poster}
      width={260}
      imageHeight={147}
      contentHeight={163}
      title={firstEntryData.metadata?.name}
      description={firstEntryData.metadata?.description}
      countdown={countdown}
    />
  );

  const firstPageEntries = data.slice(1, 7);
  const prevPageEntries = getEntriesByPage(prevPage);
  const currPageEntries = getEntriesByPage(currPage);
  const nextPageEntries = getEntriesByPage(nextPage);

  let prevGrid;
  let currGrid;
  let nextGrid;

  if (currPage === 0) {
    currGrid = (
      <>
        {firstEntry}
        <RelatedGrid data={firstPageEntries} isExpanded={false} />
      </>
    );
    nextGrid = (
      <>
        <RelatedGrid data={nextPageEntries} isExpanded={true} />
      </>
    );
  } else if (currPage === 1) {
    prevGrid = (
      <>
        {firstEntry}
        <RelatedGrid data={firstPageEntries} isExpanded={false} />
      </>
    );
    currGrid = (
      <>
        <RelatedGrid data={currPageEntries} isExpanded={true} />
      </>
    );
    nextGrid = (
      <>
        <RelatedGrid data={nextPageEntries} isExpanded={true} />
      </>
    );
  } else {
    prevGrid = (
      <>
        <RelatedGrid data={prevPageEntries} isExpanded={true} />
      </>
    );
    currGrid = (
      <>
        <RelatedGrid data={currPageEntries} isExpanded={true} />
      </>
    );
    nextGrid = (
      <>
        <RelatedGrid data={nextPageEntries} isExpanded={true} />
      </>
    );
  }

  return (
    <div className={styles.gridPages}>
      <div className={`${styles.gridPage} `}>{prevGrid}</div>
      <div className={`${styles.gridPage} `}>{currGrid}</div>
      <div className={`${styles.gridPage} `}>{nextGrid}</div>
    </div>
  );
};

export {GridPages};
