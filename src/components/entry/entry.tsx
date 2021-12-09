import { h, ComponentChildren } from "preact";
import { toHHMMSS } from "utils";
import * as styles from "./entry.scss";

interface EntryProps {
  children?: ComponentChildren;
  duration?: number;
  isLive?: boolean;
  imageUrl?: string;
  width: number;
  imageHeight: number;
  contentHeight: number;
}

const Entry = ({
  children,
  duration,
  //isLive = false,
  imageUrl,
  width,
  imageHeight,
  contentHeight
}: EntryProps) => {
  const image = imageUrl ? (
    <img
      className={styles.image}
      src={`${imageUrl}/width/${width}/height/${imageHeight}`}
      style={{ width, height: imageHeight }}
    />
  ) : undefined;

  const durationText = duration ? (
    <div className={styles.duration}>
      <div className={styles.durationText}>{toHHMMSS(duration)}</div>
    </div>
  ) : undefined;

  return (
    <div className={styles.entry} style={{ width }}>
      {image}
      {durationText}
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
