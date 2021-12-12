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
    <div className={styles.decription}>
      <div className={styles.descriptionText}>
        <MultilineText text={props.description} lineHeight={18} lines={2} />
      </div>
    </div>
  ) : undefined;

  return (
    <div className={styles.nextEntry}>
      <Entry {...props}>
        <div className={styles.upNext}>
          <span className={styles.upNextText}>Up next</span>
        </div>
        <div className={styles.titleText}>{props.title}</div>
        {description}
      </Entry>
    </div>
  );
};

export default NextEntry;
