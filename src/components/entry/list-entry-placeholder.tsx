import * as styles from './entry.scss';

const ListEntryPlaceholder = () => {
  return (
    <div className={`${styles.listEntry} ${styles.placeholder}`}>
      <div className={styles.entryImage} />
      <div className={styles.entryContent}>
        <div className={styles.textPlaceholder} />
        <div className={styles.textPlaceholder} />
      </div>
    </div>
  );
};

export {ListEntryPlaceholder};
