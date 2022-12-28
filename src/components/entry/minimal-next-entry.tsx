import {BaseNextEntry} from './base-next-entry';
import {MultilineText} from 'components/multiline-text/multiline-text';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';
import {NextEntryProps} from './next-entry';

/**
 * Minimal next entry with image and title.
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
const MinimalNextEntry = withText({
  upNext: 'playlist.up_next',
  live: 'controls.live'
})((props: NextEntryProps) => {
  const {entryDimensions, title, durationText, type, upNext, live} = props;
  const {width, contentHeight} = entryDimensions;

  const liveOrDurationText = type === KalturaPlayer.core.MediaType.LIVE ? live : durationText;

  return (
    <BaseNextEntry {...props}>
      <div className={`${styles.entryContent}`} style={{width, height: contentHeight}}>
        <div aria-label={`${upNext} ${title} ${liveOrDurationText}`} className={styles.text}>
          {title ? <MultilineText text={title} lineHeight={18} lines={1} /> : <></>}
        </div>
      </div>
    </BaseNextEntry>
  );
});

export {MinimalNextEntry};
