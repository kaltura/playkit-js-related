import NextEntry from "components/entry/next-entry";
import { h } from "preact";
import * as styles from "./related-overlay.scss";

interface EntryOverlayProps {
  data: Array<KalturaPlayerTypes.Sources>;
}

const RelatedOverlay = ({ data }: EntryOverlayProps) => {
  // const items = [];
  // items.push(
  //   <Entry
  //     key={data[0].id}
  //     thumbnailUrl={data[0].poster}
  //     width={260}
  //     imageHeight={147}
  //     descriptionHeight={163}
  //     duration={data[0].duration}
  //     name={data[0].metadata?.name}
  //   />
  // );
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
  const [firstItem, ...otherItems] = data;
  console.log(otherItems);

  // const relatedGrid = <RelatedGrid/>

  const nextEntry = (
    <NextEntry
      key={firstItem.id}
      duration={firstItem.duration}
      imageUrl={firstItem.poster}
      width={260}
      imageHeight={147}
      contentHeight={163}
      title={firstItem.metadata?.name}
      description={firstItem.metadata?.description}
    />
  );

  return <div className={styles.relatedOverlay}>{nextEntry}</div>;
};

//EntryGrid.displayName = "RelatedGrid";

export default RelatedOverlay;
