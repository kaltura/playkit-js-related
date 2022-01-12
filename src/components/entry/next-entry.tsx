import {Entry} from './entry';
import {GridEntryProps} from './grid-entry';
import * as styles from './entry.scss';
import {MultilineText} from 'components/multiline-text/multiline-text';
import {Countdown} from 'components/countdown/countdown';
import {Timer} from 'components/timer/timer';
import {RelatedContext} from 'components/related-context/related-context';
import {useContext} from 'preact/hooks';

interface NextEntryProps extends GridEntryProps {
  description?: string;
  countdown: number;
}

const NextEntry = (props: NextEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);

  let upNext = <span>Up Next</span>;
  let timer;
  if (props.countdown > 0) {
    upNext = (
      <span>
        Up Next In <Countdown seconds={props.countdown} onDone={() => relatedManager?.playNext()} />
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
