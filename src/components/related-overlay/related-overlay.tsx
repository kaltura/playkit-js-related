import NextEntry from "components/entry/next-entry";
import RelatedGrid from "components/related-grid/related-grid";
import { h } from "preact";
import * as styles from "./related-overlay.scss";

interface EntryOverlayProps {
  data: Array<KalturaPlayerTypes.Sources>;
}

const RelatedOverlay = ({ data }: EntryOverlayProps) => {
  const [nextEntryData, ...otherEntries] = data;
  const nextEntry = (
    <NextEntry
      key={nextEntryData.id}
      duration={nextEntryData.duration}
      imageUrl={nextEntryData.poster}
      width={260}
      imageHeight={147}
      contentHeight={163}
      title={nextEntryData.metadata?.name}
      description={nextEntryData.metadata?.description}
    />
  );
  return (
    <div className={styles.relatedOverlay}>
      {nextEntry}
      <RelatedGrid data={otherEntries} />
    </div>
  );
};

//EntryGrid.displayName = "RelatedGrid";

export default RelatedOverlay;
