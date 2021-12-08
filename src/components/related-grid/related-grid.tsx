import { GridEntry } from "components/entry/grid-entry";
import { h } from "preact";
import * as styles from "./related-grid.scss";

const WIDTH = 174;
const IMAGE_HEIGHT = 98;
const CONTENT_HEIGHT = 49;
interface RelatedGridProps {
  data: Array<KalturaPlayerTypes.Sources>;
}

const RelatedGrid = ({ data }: RelatedGridProps) => {
  const items = data.map((entryData) => {
    <GridEntry
      key={entryData.id}
      duration={entryData.duration}
      imageUrl={entryData.poster}
      width={WIDTH}
      imageHeight={IMAGE_HEIGHT}
      contentHeight={CONTENT_HEIGHT}
    />;
  });

  return <div className={styles.relatedGrid}>{items}</div>;
};

export default RelatedGrid;
