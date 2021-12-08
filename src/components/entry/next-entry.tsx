import { h } from "preact";
import { Entry } from "./entry";
import { GridEntryProps } from "./grid-entry";
import * as styles from "./entry.scss";

interface NextEntryProps extends GridEntryProps {
  description?: string;
}

const NextEntry = (props: NextEntryProps) => {
  return (
    <Entry {...props}>
      <div className={styles.upNextText}>Up next in ...</div>
      <div className={styles.titleText}>{props.title}</div>
      <div className={styles.descriptionText}>{props.description}</div>
    </Entry>
  );
};

export default NextEntry;
