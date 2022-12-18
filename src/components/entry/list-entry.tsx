import {useContext} from 'preact/hooks';

import {EntryImage, MultilineText, RelatedContext} from 'components';

import {GridEntryProps} from './grid-entry';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './entry.scss';

interface ListEntryProps extends GridEntryProps {
  isVertical: boolean;
}

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
      className={`${styles.entry} ${styles.listEntry} ${styles.clickable} ${isVertical ? styles.vertical : styles.horizontal}`}
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
      <EntryImage {...{poster, duration, type, width: isVertical ? 99 : 160, height: isVertical ? 56 : 90}} />
      <div className={styles.entryContent}>
        <div className={styles.text}>
          <div className={styles.entryText}>{title ? <MultilineText text={title} lineHeight={18} lines={2} /> : <></>}</div>
        </div>
      </div>
    </a>
  );
});

export {ListEntry};
