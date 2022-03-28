import {useContext} from 'preact/hooks';

import {RelatedContext} from 'components/related-context/related-context';

import {MultilineText} from 'components/multiline-text/multiline-text';
import {EntryImage} from 'components/entry-image/entry-image';
import {GridEntryProps} from './grid-entry';

import * as styles from './entry.scss';

const MinimalGridEntry = (props: GridEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);

  const {id, title, duration, type, poster, entryDimensions} = props;
  const {width, imageHeight, contentHeight} = entryDimensions;

  return (
    <div
      className={`${styles.entry} ${styles.gridEntry} ${styles.minimal} ${styles.clickable} ${styles.minimal}`}
      style={{width, color: KalturaPlayer.ui.style.white}}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}>
      <EntryImage {...{poster, duration, type, width: width / 2 - 10, height: imageHeight}} />
      <div className={styles.entryContent} style={{width: width / 2 + 10, height: contentHeight}}>
        <div className={styles.text}>
          <div className={styles.entryText}>{title ? <MultilineText text={title} lineHeight={18} lines={2} /> : <></>}</div>
        </div>
      </div>
    </div>
  );
};

export {MinimalGridEntry};
