import {useContext} from 'preact/hooks';

import {EntryImage, MultilineText, RelatedContext} from 'components';

import {GridEntryProps} from './grid-entry';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';

interface ListEntryProps extends GridEntryProps {
  isVertical: boolean;
}

/**
 * List entry with image and title.
 *
 * @param {object} props Component props.
 * @param {string} props.title Entry title.
 * @param {number} props.id Entry internal id.
 * @param {number} props.duration Entry duration.
 * @param {string} props.type Entry type.
 * @param {string} props.poster Entry poster.
 * @param {string} props.live Live label.
 * @param {boolean} props.isVertical If true, indicates that the list entry is vertical, if false indicates that it's horizontal.
 */
const ListEntry = withText({
  live: 'controls.live'
})((props: ListEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);
  const {id, title, duration, durationText, type, poster, live, isVertical} = props;
  const liveOrDurationText = type === KalturaPlayer.core.MediaType.LIVE ? live : durationText;

  return (
    <a
      key={id}
      tabIndex={0}
      className={`${styles.entry} ${styles.listEntry} ${isVertical ? styles.vertical : styles.horizontal}`}
      style={{width: 'auto', color: KalturaPlayer.ui.style.white, 'line-height': 'normal'}}
      aria-label={`${title} ${liveOrDurationText}`}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}
      onKeyDown={({keyCode}: {keyCode: number}) => {
        if (keyCode === 13 || keyCode === 32) {
          relatedManager?.playSelected(id);
        }
      }}>
      <EntryImage
        {...{
          poster,
          duration,
          type
        }}
      />
      <div className={styles.entryContent}>
        <div className={styles.text}>
          <div className={styles.entryText}>{title ? <MultilineText text={title} lineHeight={18} lines={2} /> : <></>}</div>
        </div>
      </div>
    </a>
  );
});

export {ListEntry};
