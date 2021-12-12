import NextEntry from "components/entry/next-entry";
import RelatedGrid from "components/related-grid/related-grid";
import { h } from "preact";
import { useState } from "preact/hooks";
import * as styles from "./related-overlay.scss";
interface EntryOverlayWrapperProps {
  player: KalturaPlayerTypes.Player;
  toggleOnPlayPause: boolean;
  data: KalturaPlayerTypes.Sources[];
}

interface EntryOverlayProps {
  data: KalturaPlayerTypes.Sources[];
}

const RelatedOverlayWrapper = ({
  player,
  toggleOnPlayPause,
  data
}: EntryOverlayWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  if (toggleOnPlayPause) {
    player.addEventListener(KalturaPlayer.core.EventType.PAUSE, () =>
      setIsVisible(true)
    );
    player.addEventListener(KalturaPlayer.core.EventType.PLAY, () =>
      setIsVisible(false)
    );
  }

  const relatedOverlay = isVisible ? <RelatedOverlay data={data} /> : undefined;
  return <div className={styles.relatedOverlayWrapper}>{relatedOverlay}</div>;
};

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

export { RelatedOverlay, RelatedOverlayWrapper };
