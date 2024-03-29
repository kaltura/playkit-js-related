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

/**
 * Full size grid entry with image and title.
 *
 * @param {object} props Component props.
 * @param {string} props.title Entry title.
 * @param {number} props.id Internal entry id.
 * @param {ComponentChildren} props.children Component children.
 * @param {number} props.duration Entry duration.
 * @param {string} props.type Entry type.
 * @param {string} props.poster Entry poster.
 * @param {object} props.entryDimensions Dimensions for entry render.
 * @param {string} props.live Live label.
 */
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
      className={`${styles.entry} ${styles.gridEntry}`}
      style={{width, color: KalturaPlayer.ui.style.white, 'line-height': 'normal'}}
      aria-label={`${title} ${liveOrDurationText}`}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}
      onKeyDown={({keyCode}: {keyCode: number}) => {
        if (keyCode === 13 || keyCode === 32) {
          relatedManager?.playSelected(id);
        }
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
