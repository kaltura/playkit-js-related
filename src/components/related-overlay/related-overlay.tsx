import NextEntry from "components/entry/next-entry";
import RelatedGrid from "components/related-grid/related-grid";
import { useState } from "preact/hooks";
import * as styles from "./related-overlay.scss";
interface RelatedOverlayProps {
  player: KalturaPlayerTypes.Player;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  data: KalturaPlayerTypes.Sources[];
}

const RelatedOverlay = ({
  player,
  showOnPlaybackDone,
  showOnPlaybackPaused,
  data
}: RelatedOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  player.addEventListener(KalturaPlayer.core.EventType.PLAY, () =>
    setIsVisible(false)
  );

  if (showOnPlaybackDone) {
    player.addEventListener(KalturaPlayer.core.EventType.PLAYBACK_ENDED, () =>
      setIsVisible(true)
    );
  }

  if (showOnPlaybackPaused) {
    player.addEventListener(KalturaPlayer.core.EventType.PAUSE, () =>
      setIsVisible(true)
    );
  }

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
    <div
      className={`${styles.relatedOverlay} ${isVisible ? "" : styles.hidden}`}
    >
      <div className={styles.content}>
        {nextEntry}
        <RelatedGrid onClick={() => undefined} data={otherEntries} />
      </div>
    </div>
  );
};

export default RelatedOverlay;
