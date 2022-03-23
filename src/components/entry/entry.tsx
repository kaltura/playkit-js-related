import {EntryImage} from 'components/entry-image/entry-image';
import {RelatedContext} from 'components/related-context/related-context';
import {ComponentChildren} from 'preact';
import {useContext} from 'preact/hooks';
import {EntryDimensions} from 'types/entry-dimensions';
import * as styles from './entry.scss';

interface EntryProps {
  id: number;
  children?: ComponentChildren;
  duration?: number;
  type: KalturaPlayerTypes.EntryTypes;
  poster?: string;
  entryDimensions: EntryDimensions;
}

const Entry = ({id, children, duration, type, poster, entryDimensions}: EntryProps) => {
  const {relatedManager} = useContext(RelatedContext);
  const color = KalturaPlayer.ui.style.white;
  const {width, imageHeight, contentHeight} = entryDimensions;

  return (
    <div
      className={`${styles.entry} ${styles.clickable}`}
      style={{width, color}}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}>
      <EntryImage {...{poster, duration, type, width, height: imageHeight}} />
      <div className={styles.entryContent} style={{width, height: contentHeight}}>
        {children}
      </div>
    </div>
  );
};

export {Entry, EntryProps};
