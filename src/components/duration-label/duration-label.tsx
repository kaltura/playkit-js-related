const {withText} = KalturaPlayer.ui.preacti18n;
const {toHHMMSS} = KalturaPlayer.ui.utils;

import * as styles from './duration-label.scss';

/**
 * Displays formatted duration of entry playback, or a live label for live entries.
 *
 * @param {object} props Duration label props.
 * @param {string} type Entry type.
 * @param {number} duration Entry playack duration.
 * @param {string} liveText Live label text.
 */
const DurationLabel = withText({
  liveText: 'controls.live'
})(({type, duration, liveText}: {type?: string; duration: number; liveText: string}) => {
  if (type === KalturaPlayer.core.MediaType.LIVE) {
    return (
      <div
        style={{color: KalturaPlayer.ui.style.white, 'background-color': KalturaPlayer.ui.style.liveColor}}
        className={`${styles.duration} ${styles.live}`}>
        <span className={styles.liveText}>{liveText}</span>
      </div>
    );
  } else if (duration) {
    return (
      <div style={{color: KalturaPlayer.ui.style.white}} className={styles.duration}>
        <span tabIndex={-1} className={styles.durationText} aria-hidden>
          {toHHMMSS(duration)}
        </span>
      </div>
    );
  }
  return <></>;
});

export {DurationLabel};
