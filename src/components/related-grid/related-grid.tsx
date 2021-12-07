import { h } from "preact";
import RelatedGridItem from "./related-grid-item";
import * as styles from "./related-grid.scss";

interface RelatedGridProps {
  data: Array<KalturaPlayerTypes.Sources>;
}

const RelatedGrid = ({ data }: RelatedGridProps) => {
  const items = [];
  items.push(
    <RelatedGridItem
      key={data[0].id}
      thumbnailUrl={data[0].poster}
      width={260}
      imageHeight={147}
      descriptionHeight={163}
    />
  );
  // for (let i = 1; i < data.length; ++i) {
  //   const item = data[i];
  //   items.push(
  //     <div key={item.id}>
  //       <RelatedGridItem
  //         thumbnailUrl={item.poster}
  //         duration={item.duration}
  //         description={item.metadata?.description}
  //       />
  //     </div>
  //   );
  // }

  return <div className={styles.relatedGrid}>{items}</div>;
};

RelatedGrid.displayName = "RelatedGrid";

export default RelatedGrid;
