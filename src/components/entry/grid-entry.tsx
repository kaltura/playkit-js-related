import {ComponentChildren} from 'preact';
import {useContext} from 'preact/hooks';

import {MultilineText} from 'components/multiline-text/multiline-text';
import {RelatedContext} from 'components/related-context/related-context';
import {EntryImage} from 'components/entry-image/entry-image';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';
import {EntryDimensions} from 'types/entry-dimensions';

interface GridEntryProps {
  title?: string;
  id: number;
  children?: ComponentChildren;
  duration?: number;
  durationText: string;
  type: KalturaPlayerTypes.EntryTypes;
  poster?: string;
  entryDimensions: EntryDimensions;
  live: string;
}

const GridEntry = withText({
  live: 'controls.live'
})((props: GridEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);

  const {id, title, duration, durationText, type, poster, entryDimensions, live} = props;
  const {width, imageHeight, contentHeight} = entryDimensions;

  const liveOrDurationText = type === KalturaPlayer.core.MediaType.LIVE ? live : durationText;

  return (
    <a
      key={id}
      tabIndex={0}
      className={`${styles.entry} ${styles.gridEntry} ${styles.clickable}`}
      style={{width, color: KalturaPlayer.ui.style.white, 'line-height': 'normal'}}
      aria-label={`${title} ${liveOrDurationText}`}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}>
      <EntryImage {...{poster, duration, type, width, height: imageHeight}} />
      <div className={styles.entryContent} style={{width, height: contentHeight}}>
        <div className={styles.text}>
          <div className={styles.entryText}>{title ? <MultilineText text={title} lineHeight={18} lines={2} /> : <></>}</div>
        </div>
      </div>
    </a>
  );
});

export {GridEntry, GridEntryProps};
