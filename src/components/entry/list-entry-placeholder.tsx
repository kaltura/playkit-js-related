import {Thumbnail} from 'components';
import * as styles from './entry.scss';

/**
 * Animated placeholder for a list entry.
 *
 * @param {object} props Component props.
 * @param {boolean} props.isVertical If true, indicates that the entry placeholder is vertical, otherwise it's horizontal.
 */

const ListEntryPlaceholder = ({isVertical}: {isVertical: boolean}) => {
  return (
    <div className={`${styles.listEntry} ${styles.placeholder} ${isVertical ? styles.vertical : styles.horizontal}`}>
      <div className={styles.entryImage}>
        <Thumbnail />
      </div>
      <div className={styles.entryContent}>
        <div className={styles.textPlaceholder} />
        <div className={styles.textPlaceholder} />
      </div>
    </div>
  );
};

export {ListEntryPlaceholder};
