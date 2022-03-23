import {useState, useContext} from 'preact/hooks';

import {GridEntryProps} from './grid-entry';
import {Countdown} from 'components/countdown/countdown';
import {BaseNextEntry} from './base-next-entry';
import {MultilineText} from 'components/multiline-text/multiline-text';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';
import {RelatedContext} from 'components/related-context/related-context';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {relatedManager} = useContext(RelatedContext);

  const {entryDimensions, countdown} = props;
  const {width, contentHeight} = entryDimensions;
  const [countdownCancelled, setCountdownCancelled] = useState(false);

  return (
    <BaseNextEntry {...{...props, onCancel: () => setCountdownCancelled(true)}}>
      <div className={styles.entryContent} style={{width, height: contentHeight}}>
        <div className={styles.upNext}>
          <span className={styles.upNextText}>
            {countdown > 0 && !countdownCancelled ? (
              <span>
                {`${props.upNextIn} `}
                <Countdown seconds={countdown} />
              </span>
            ) : (
              <span>{props.upNext}</span>
            )}
          </span>
        </div>
        <div className={styles.titleText}>{props.title}</div>
        <div className={styles.entryText}>{props.description ? <MultilineText text={props.description} lineHeight={18} lines={2} /> : <></>}</div>
      </div>
    </BaseNextEntry>
  );
});

export {NextEntry};
