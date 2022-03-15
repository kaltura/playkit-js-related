const {withText} = KalturaPlayer.ui.preacti18n;
const {toHHMMSS} = KalturaPlayer.ui.utils;

import * as styles from './duration-label.scss';

const DurationLabel = withText({
  liveText: 'controls.live'
})(({type, duration, liveText}: {type?: string; duration: number; liveText: string}) => {
  if (type === KalturaPlayer.core.MediaType.LIVE) {
    return (
      <div className={`${styles.duration} ${styles.live}`}>
        <span className={styles.liveText}>{liveText}</span>
      </div>
    );
  } else if (duration) {
    return (
      <div className={styles.duration}>
        <span className={styles.durationText}>{toHHMMSS(duration)}</span>
      </div>
    );
  }
  return <></>;
});

export {DurationLabel};
