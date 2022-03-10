import {GridEntry} from 'components/entry/grid-entry';
import {Sources} from 'types/sources';
import * as styles from './related-grid.scss';

const IMAGE_HEIGHT = 98;
const CONTENT_HEIGHT = 49;

const WIDTH = 174;
const WIDTH_EXPANDED = 195.5;

interface RelatedGridEntriesProps {
  data: Sources[];
  entriesPerPage: number;
  isExpanded?: boolean;
}

const RelatedGridEntries = ({data, entriesPerPage, isExpanded = true}: RelatedGridEntriesProps) => {
  const entries = [];
  const width = isExpanded ? WIDTH_EXPANDED : WIDTH;
  const pageSize = isExpanded ? entriesPerPage : entriesPerPage - 2;

  for (let i = 0; i < pageSize; ++i) {
    const entryData = data[i];
    const entry = entryData ? (
      <GridEntry
        id={entryData.internalIndex}
        key={entryData.internalIndex}
        duration={entryData.duration}
        type={entryData.type}
        imageUrl={entryData.poster}
        width={width}
        imageHeight={IMAGE_HEIGHT}
        contentHeight={CONTENT_HEIGHT}
        title={entryData.metadata?.name}
      />
    ) : undefined;

    const row = i % 2;
    const col = (i - row) / 2;

    entries.push(<div className={`${styles[`row${row}`]} ${styles[`col${col}`]}`}>{entry}</div>);
  }

  return <div className={styles.relatedGridEntries}>{entries}</div>;
};

export {RelatedGridEntries};
