import MultilineText from "components/multiline-text/multiline-text";
import { Entry, EntryProps } from "./entry";
import * as styles from "./entry.scss";

interface GridEntryProps extends EntryProps {
  title?: string;
}

const GridEntry = (props: GridEntryProps) => {
  const { title, ...otherProps } = props;

  const entryTitle = title ? (
    <div className={styles.decription}>
      <div className={styles.descriptionText}>
        <MultilineText text={title} lineHeight={18} lines={2} />
      </div>
    </div>
  ) : undefined;

  return (
    <div className={styles.gridEntry}>
      <Entry {...otherProps}>{entryTitle}</Entry>
    </div>
  );
};

export { GridEntry, GridEntryProps };
