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

/**
 * Full size next entry, with image, title and description.
 * Wraps BaseNextEntry.
 *
 * @param {object} props Component props.
 * @param {string} props.title Entry title.
 * @param {number} props.id Entry internal id.
 * @param {object} props.children Component children.
 * @param {number} props.duration Entry playback duration.
 * @param {string} props.type Entry type.
 * @param {string} props.poster Entry poster.
 * @param {object} props.entryDimensions Entry render dimensions.
 * @param {string} props.live Live label.
 * @param {string} props.description Entry description.
 * @param {number} props.countdown Countdown for playback of next entry.
 * @param {string} props.upNext Up next label.
 * @param {string} props.upNextIn Up next in label.
 */
const NextEntry = withText({
  upNext: 'playlist.up_next',
  upNextIn: 'playlist.up_next_in',
  live: 'controls.live'
})((props: NextEntryProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {relatedManager} = useContext(RelatedContext);

  const {entryDimensions, countdown, title, description, durationText, type, upNext, upNextIn, live} = props;
  const {width, contentHeight} = entryDimensions;
  const [countdownCancelled, setCountdownCancelled] = useState(false);
  const liveOrDurationText = type === KalturaPlayer.core.MediaType.LIVE ? live : durationText;

  return (
    <BaseNextEntry {...{...props, onCancel: () => setCountdownCancelled(true)}}>
      <div
        aria-label={`${upNext} ${title} ${description} ${liveOrDurationText}`}
        className={styles.entryContent}
        style={{width, height: contentHeight}}>
        <div className={styles.upNext}>
          <span className={styles.upNextText}>
            {countdown > 0 && !countdownCancelled ? (
              <span>
                {`${upNextIn} `}
                <Countdown seconds={countdown} />
              </span>
            ) : (
              <span>{upNext}</span>
            )}
          </span>
        </div>
        <div className={styles.titleText}>{title}</div>
        <div className={`${styles.entryText} ${styles.text}`}>
          {description ? <MultilineText text={description} lineHeight={18} lines={2} /> : <></>}
        </div>
      </div>
    </BaseNextEntry>
  );
});

export {NextEntry, NextEntryProps};
