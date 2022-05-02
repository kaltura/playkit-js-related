import {BaseNextEntry} from './base-next-entry';
import {MultilineText} from 'components/multiline-text/multiline-text';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';
import {NextEntryProps} from './next-entry';

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
