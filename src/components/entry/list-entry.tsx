import {useContext} from 'preact/hooks';

import {EntryImage, MultilineText, RelatedContext} from 'components';

import {GridEntryProps} from './grid-entry';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';

interface ListEntryProps extends GridEntryProps {
  isVertical: boolean;
}

const VERTICAL_IMAGE_WIDTH = 99;
const HORIZONTAL_IMAGE_WIDTH = 160;
const VERTICAL_IMAGE_HEIGHT = 56;
const HORITONTAL_IMAGE_HEIGHT = 90;

/**
 * list entry, including image and title
 *
 * @param {object} props component props
 * @param {string} props.title entry title
 * @param {number} props.id entry id
 * @param {number} props.duration entry duration
 * @param {string} props.type entry type
 * @param {string} props.poster entry poster
 * @param {object} props.entryDimensions dimensions for entry render
 * @param {string} props.live live label
 * @param {boolean} props.isVertical if true, indicates that the list entry is vertical, if false indicates that it's horizontal
 * @returns {object} grid entry component
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
          type,
          width: isVertical ? VERTICAL_IMAGE_WIDTH : HORIZONTAL_IMAGE_WIDTH,
          height: isVertical ? VERTICAL_IMAGE_HEIGHT : HORITONTAL_IMAGE_HEIGHT
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
