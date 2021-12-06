import { h } from "preact";

const RelatedGrid = (props: any) => {
  const items = props.items.map((item: KalturaPlayerTypes.Sources) => (
    <div key={item.id}>{item.id}</div>
  ));

  return (
    <div style="height: 100%; width: 100%" class="related-grid">
      {items.length}
    </div>
  );
};

RelatedGrid.displayName = "RelatedGrid";

export default RelatedGrid;
