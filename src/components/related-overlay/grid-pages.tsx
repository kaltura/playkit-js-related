import {ComponentChildren} from 'preact';

import {RelatedGrid} from 'components/related-grid/related-grid';
import {NextEntry} from 'components/entry/next-entry';

import * as styles from './related-overlay.scss';
import {Sources} from 'types/sources';

const GridPages = ({
  data,
  countdown,
  prevPage,
  currPage,
  nextPage
}: {
  data: Sources[];
  countdown: number;
  prevPage: number;
  currPage: number;
  nextPage: number;
}) => {
  const getEntriesByPage = (page: number) => data.slice(page * 7, page * 7 + 8);

  if (!data.length) return <></>;

  if (currPage < 2) {
    const [firstEntryData] = data;
    const firstPage = (
      <GridPage>
        <NextEntry
          id={firstEntryData.internalIndex}
          key={firstEntryData.internalIndex}
          duration={firstEntryData.duration}
          type={firstEntryData.type}
          imageUrl={firstEntryData.poster}
          width={260}
          imageHeight={147}
          contentHeight={163}
          title={firstEntryData.metadata?.name}
          description={firstEntryData.metadata?.description}
          countdown={countdown}
        />
        <RelatedGrid data={data.slice(1, 7)} isExpanded={false} />
      </GridPage>
    );
    const secondPage = (
      <GridPage>
        <RelatedGrid data={getEntriesByPage(1)} />
      </GridPage>
    );

    return (
      <div className={styles.gridPages}>
        {currPage === 0 ? (
          <>
            <GridPage />
            {firstPage}
            {secondPage}
          </>
        ) : (
          <>
            {firstPage}
            {secondPage}
            <GridPage>
              <RelatedGrid data={getEntriesByPage(2)} isExpanded={true} />
            </GridPage>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.gridPages}>
      <GridPage>
        <RelatedGrid data={getEntriesByPage(prevPage)} />
      </GridPage>
      <GridPage>
        <RelatedGrid data={getEntriesByPage(currPage)} />
      </GridPage>
      <GridPage>
        <RelatedGrid data={getEntriesByPage(nextPage)} />
      </GridPage>
    </div>
  );
};

const GridPage = ({children}: {children?: ComponentChildren}) => <div className={`${styles.gridPage} `}>{children}</div>;
export {GridPages};
