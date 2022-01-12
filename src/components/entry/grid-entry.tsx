import {Entry, EntryProps} from './entry';
import {EntryText} from './entry-text';
import * as styles from './entry.scss';

interface GridEntryProps extends EntryProps {
  title?: string;
}

const GridEntry = (props: GridEntryProps) => {
  const {title, ...otherProps} = props;
  return (
    <div className={styles.gridEntry}>
      <Entry {...otherProps}>
        <div className={styles.text}>
          <EntryText text={title || ''} />
        </div>
      </Entry>
    </div>
  );
};

export {GridEntry, GridEntryProps};
