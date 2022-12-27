import {BaseNextEntry} from './base-next-entry';
import {MultilineText} from 'components/multiline-text/multiline-text';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';
import {NextEntryProps} from './next-entry';

/**
 * minimal next entry, including image and title
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
 * @returns {object} minimal next entry component
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
