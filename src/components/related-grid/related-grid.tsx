import {GridEntry} from 'components/entry/grid-entry';
import * as styles from './related-grid.scss';

const IMAGE_HEIGHT = 98;
const CONTENT_HEIGHT = 49;

const WIDTH = 174;
const WIDTH_EXPANDED = 195.5;
interface RelatedGridProps {
  data: KalturaPlayerTypes.Sources[];
  isExpanded: boolean;
}

const ENTRIES_NUM = 6;
const ENTRIES_EXPANDED_NUM = 8;

const RelatedGrid = ({data, isExpanded}: RelatedGridProps) => {
  const entries = [];

  const entriesPerPage = isExpanded ? ENTRIES_EXPANDED_NUM : ENTRIES_NUM;
  const width = isExpanded ? WIDTH_EXPANDED : WIDTH;

  for (let i = 0; i < entriesPerPage; ++i) {
    const entryData = data[i];
    const entry = entryData ? (
      <GridEntry
        id={entryData.id}
        key={entryData.id}
        duration={entryData.duration}
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

  return <div className={styles.relatedGrid}>{entries}</div>;
};

export {RelatedGrid};
