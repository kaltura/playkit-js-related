import NextEntry from "components/entry/next-entry";
import RelatedContext from "components/related-context/related-context";
import RelatedGrid from "components/related-grid/related-grid";
import { useState } from "preact/hooks";
import RelatedManager from "related-manager";
import * as styles from "./related-overlay.scss";

interface RelatedOverlayProps {
  relatedManager: RelatedManager;
  showOnPlaybackDone: boolean;
  showOnPlaybackPaused: boolean;
  data: KalturaPlayerTypes.Sources[];
  isPaused: boolean;
  isPlaybackEnded: boolean;
}

const { connect } = KalturaPlayer.ui.redux;
const mapStateToProps = (state: any) => {
  return {
    isPaused: state.engine.isPaused,
    isPlaybackEnded: state.engine.isPlaybackEnded
  };
};

const RelatedOverlay = ({
  relatedManager,
  data,
  isPaused,
  isPlaybackEnded
}: RelatedOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const showGrid =
    (isPaused && relatedManager.showOnPlaybackPaused) ||
    (isPlaybackEnded && relatedManager.showOnPlaybackDone);
  setIsVisible(showGrid);

  const [nextEntryData, ...otherEntries] = data;
  const nextEntry = (
    <NextEntry
      id={nextEntryData.id}
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
      <RelatedContext.Provider value={{ relatedManager }}>
        <div className={styles.content}>
          {nextEntry}
          <RelatedGrid data={otherEntries} />
        </div>
      </RelatedContext.Provider>
    </div>
  );
};

const RelatedOverlayWrapper = connect(mapStateToProps)(RelatedOverlay);

export default RelatedOverlayWrapper;
