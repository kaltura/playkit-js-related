import {Entry} from './entry';
import {GridEntryProps} from './grid-entry';
import * as styles from './entry.scss';
import {MultilineText} from 'components/multiline-text/multiline-text';
import {CountdownText} from 'components/countdown/countdown-text';
import {Timer} from 'components/timer/timer';

interface NextEntryProps extends GridEntryProps {
  description?: string;
  countdown: number;
}

const NextEntry = (props: NextEntryProps) => {
  let upNext = <span>Up Next</span>;
  let timer;
  if (props.countdown > 0) {
    upNext = (
      <span>
        Up Next In <CountdownText seconds={props.countdown} />
      </span>
    );
    timer = <Timer seconds={props.countdown} />;
  }

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
        <div className={styles.timer}>{timer}</div>
        <div className={styles.upNext}>
          <span className={styles.upNextText}>{upNext}</span>
        </div>
        <div className={styles.titleText}>{props.title}</div>
        {description}
      </Entry>
    </div>
  );
};

export {NextEntry};
