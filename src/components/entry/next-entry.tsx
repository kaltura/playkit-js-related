import {Entry} from './entry';
import {GridEntryProps} from './grid-entry';
import * as styles from './entry.scss';
import {Countdown} from 'components/countdown/countdown';
import {Timer} from 'components/timer/timer';
import {RelatedContext} from 'components/related-context/related-context';
import {useContext} from 'preact/hooks';
import {EntryText} from './entry-text';

const {withText} = KalturaPlayer.ui.preacti18n;

interface NextEntryProps extends GridEntryProps {
  description?: string;
  countdown: number;
  upNext: string;
  upNextIn: string;
}

const NextEntry = withText({
  upNext: 'playlist.up_next',
  upNextIn: 'related.upNextIn'
})((props: NextEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);

  let upNext = <span>{props.upNext}</span>;
  let timer;
  if (props.countdown > 0) {
    upNext = (
      <span>
        {`${props.upNextIn} `}
        <Countdown seconds={props.countdown} onDone={() => relatedManager?.playNext()} />
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
});

export {NextEntry};
