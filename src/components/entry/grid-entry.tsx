import { h } from "preact";
import { Entry, EntryProps } from "./entry";
import * as styles from "./entry.scss";

interface GridEntryProps extends EntryProps {
  title?: string;
}

const GridEntry = (props: GridEntryProps) => {
  const { title, ...otherProps } = props;
  return (
    <Entry {...otherProps}>
      <div className={styles.titleText}>{{ title }}</div>
    </Entry>
  );
};

export { GridEntry, GridEntryProps };
