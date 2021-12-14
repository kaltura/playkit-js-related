import { ComponentChildren } from "preact";
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
  // eslint-disable-next-line no-unused-vars
  onClick?: (id: string) => void;
}

const Entry = ({
  id,
  children,
  duration,
  //isLive = false,x
  imageUrl,
  width,
  imageHeight,
  contentHeight,
  onClick = () => undefined
}: EntryProps) => {
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
        onClick(id);
        return undefined;
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
