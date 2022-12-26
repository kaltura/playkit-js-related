import {CloseButton} from 'components/close-button/close-button';
import * as styles from './related-list.scss';

/**
 * @returns {*} component containing related list header text and close button
 */
const RelatedListHeader = () => {
  return (
    <div className={styles.relatedListHeader}>
      <div className={styles.title}>Related Videos</div>
      <CloseButton />
    </div>
  );
};

export {RelatedListHeader};
