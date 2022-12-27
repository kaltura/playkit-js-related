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
 * full size next entry, including image, title and description
 *
 * @param {object} props component props
 * @param {string} props.title entry title
 * @param {number} props.id entry id
 * @param {object} props.children component children
 * @param {number} props.duration entry duration
 * @param {string} props.type entry type
 * @param {string} props.poster entry poster
 * @param {object} props.entryDimensions dimensions for entry render
 * @param {string} props.live live label
 * @param {string} props.description entry description
 * @param {number} props.countdown countdown for playback of next entry
 * @param {string} props.upNext up next label
 * @param {string} props.upNextIn up next in label
 * @returns {object} next entry component
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
