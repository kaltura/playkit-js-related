import {ComponentChildren} from 'preact';
import {useContext} from 'preact/hooks';

import {MultilineText} from 'components/multiline-text/multiline-text';
import {RelatedContext} from 'components/related-context/related-context';
import {EntryImage} from 'components/entry-image/entry-image';

import * as styles from './entry.scss';
import {EntryDimensions} from 'types/entry-dimensions';

interface GridEntryProps {
  title?: string;
  id: number;
  children?: ComponentChildren;
  duration?: number;
  type: KalturaPlayerTypes.EntryTypes;
  poster?: string;
  entryDimensions: EntryDimensions;
}

const GridEntry = (props: GridEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);

  const {id, title, duration, type, poster, entryDimensions} = props;
  const {width, imageHeight, contentHeight} = entryDimensions;

  return (
    <div
      key={id}
      className={`${styles.entry} ${styles.gridEntry} ${styles.clickable}`}
      style={{width, color: KalturaPlayer.ui.style.white}}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}>
      <EntryImage {...{poster, duration, type, width, height: imageHeight}} />
      <div className={styles.entryContent} style={{width, height: contentHeight}}>
        <div className={styles.text}>
          <div className={styles.entryText}>{title ? <MultilineText text={title} lineHeight={18} lines={2} /> : <></>}</div>
        </div>
      </div>
    </div>
  );
};

export {GridEntry, GridEntryProps};
