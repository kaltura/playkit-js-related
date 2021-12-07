import { h } from "preact";
import * as styles from "./related-grid.scss";

const RelatedGrid = (props: any) => {
  const items = props.items.map((item: KalturaPlayerTypes.Sources) => (
    <div key={item.id}>{item.id}</div>
  ));

  return <div className={styles.relatedGrid}>{items.length}</div>;
};

RelatedGrid.displayName = "RelatedGrid";

export default RelatedGrid;
