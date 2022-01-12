import {Entry} from './entry';
import {GridEntryProps} from './grid-entry';
import * as styles from './entry.scss';
import {Countdown} from 'components/countdown/countdown';
import {Timer} from 'components/timer/timer';
import {RelatedContext} from 'components/related-context/related-context';
import {useContext} from 'preact/hooks';
import {EntryText} from './entry-text';

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

  return (
    <div className={styles.nextEntry}>
      <Entry {...props}>
        <div className={styles.timer}>{timer}</div>
        <div className={styles.upNext}>
          <span className={styles.upNextText}>{upNext}</span>
        </div>
        <div className={styles.titleText}>{props.title}</div>
        <div className={styles.text}>
          <EntryText text={props.description || ''} />
        </div>
      </Entry>
    </div>
  );
};

export {NextEntry};
