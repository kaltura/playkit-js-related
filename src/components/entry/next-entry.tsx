import {GridEntryProps} from './grid-entry';
import * as styles from './entry.scss';
import {Countdown} from 'components/countdown/countdown';
import {Timer} from 'components/timer/timer';
import {BaseNextEntry} from './base-next-entry';
import {MultilineText} from 'components/multiline-text/multiline-text';

const {withText} = KalturaPlayer.ui.preacti18n;

interface NextEntryProps extends GridEntryProps {
  description?: string;
  countdown: number;
  upNext: string;
  upNextIn: string;
  hideUpNext?: boolean;
}

const NextEntry = withText({
  upNext: 'playlist.up_next',
  upNextIn: 'related.upNextIn'
})((props: NextEntryProps) => {
  const {entryDimensions} = props;
  const {width, contentHeight} = entryDimensions;

  let upNext = <span>{props.upNext}</span>;
  let timer;
  if (props.countdown > 0) {
    upNext = (
      <span>
        {`${props.upNextIn} `}
        <Countdown seconds={props.countdown} />
      </span>
    );
    timer = <Timer seconds={props.countdown} />;
  }

  return (
    <BaseNextEntry {...props}>
      <div className={styles.entryContent} style={{width, height: contentHeight}}>
        <div className={styles.timer}>{timer}</div>
        <div className={styles.upNext}>
          <span className={styles.upNextText}>{upNext}</span>
        </div>
        <div className={styles.titleText}>{props.title}</div>
        <div className={styles.entryText}>{props.description ? <MultilineText text={props.description} lineHeight={18} lines={2} /> : <></>}</div>
      </div>
    </BaseNextEntry>
  );
});

export {NextEntry};
