import * as styles from './entry.scss';

/**
 * animated placeholder for a list entry
 *
 * @param {object} props component props
 * @param {boolean} props.isVertical indicates whether the entry is vertical
 * @returns {object} list entry placeholder component
 */
const ListEntryPlaceholder = ({isVertical}: {isVertical: boolean}) => {
  return (
    <div className={`${styles.listEntry} ${styles.placeholder} ${isVertical ? styles.vertical : styles.horizontal}`}>
      <div className={styles.entryImage} />
      <div className={styles.entryContent}>
        <div className={styles.textPlaceholder} />
        <div className={styles.textPlaceholder} />
      </div>
    </div>
  );
};

export {ListEntryPlaceholder};
