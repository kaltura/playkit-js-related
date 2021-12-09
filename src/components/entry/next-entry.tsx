import { h } from "preact";
import { Entry } from "./entry";
import { GridEntryProps } from "./grid-entry";
import * as styles from "./entry.scss";
import MultilineText from "components/multiline-text/multiline-text";

interface NextEntryProps extends GridEntryProps {
  description?: string;
}

const NextEntry = (props: NextEntryProps) => {
  const description = props.description ? (
    <MultilineText text={props.description} lineHeight={18} lines={5} />
  ) : undefined;

  return (
    <Entry {...props}>
      <div className={styles.nextEntry}>
        <div className={styles.upNextText}>Up next</div>
        <div className={styles.titleText}>{props.title}</div>
        <div className={styles.descriptionText}>{description}</div>
      </div>
    </Entry>
  );
};

export default NextEntry;
