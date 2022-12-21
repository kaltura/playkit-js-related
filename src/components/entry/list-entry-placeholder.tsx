import * as styles from './entry.scss';

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
