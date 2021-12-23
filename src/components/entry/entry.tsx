import RelatedContext from "components/related-context/related-context";
import { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { toHHMMSS } from "utils";
import * as styles from "./entry.scss";

interface EntryProps {
  id: string;
  children?: ComponentChildren;
  duration?: number;
  isLive?: boolean;
  imageUrl?: string;
  width: number;
  imageHeight: number;
  contentHeight: number;
}

const Entry = ({
  id,
  children,
  duration,
  //isLive = false,x
  imageUrl,
  width,
  imageHeight,
  contentHeight
}: EntryProps) => {
  const { relatedManager } = useContext(RelatedContext);

  const image = imageUrl ? (
    <img
      className={styles.image}
      src={`${imageUrl}/width/${width}/height/${imageHeight}`}
      style={{ width, height: imageHeight }}
    />
  ) : undefined;

  const entryDuration = duration ? (
    <div className={styles.duration}>
      <span className={styles.durationText}>{toHHMMSS(duration)}</span>
    </div>
  ) : undefined;

  return (
    <div
      className={styles.entry}
      style={{ width }}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}
    >
      {image}
      {entryDuration}
      <div
        className={styles.entryContent}
        style={{ width, height: contentHeight }}
      >
        {children}
      </div>
    </div>
  );
};

export { Entry, EntryProps };
