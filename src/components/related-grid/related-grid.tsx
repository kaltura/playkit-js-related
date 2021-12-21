import { GridEntry } from "components/entry/grid-entry";
import * as styles from "./related-grid.scss";

const WIDTH = 174;
const IMAGE_HEIGHT = 98;
const CONTENT_HEIGHT = 49;
const ENTRIES_PER_PAGE = 6;
interface RelatedGridProps {
  data: KalturaPlayerTypes.Sources[];
}

const RelatedGrid = ({ data }: RelatedGridProps) => {
  const entries = [];
  for (let i = 0; i < ENTRIES_PER_PAGE; ++i) {
    const entryData = data[i];
    const entry = entryData ? (
      <GridEntry
        id={entryData.id}
        key={entryData.id}
        duration={entryData.duration}
        imageUrl={entryData.poster}
        width={WIDTH}
        imageHeight={IMAGE_HEIGHT}
        contentHeight={CONTENT_HEIGHT}
        title={entryData.metadata?.name}
      />
    ) : undefined;
    entries.push(<div className={styles[`entry${i + 1}`]}>{entry}</div>);
  }

  return <div className={styles.relatedGrid}>{entries}</div>;
};

export default RelatedGrid;
