import {CloseButton} from 'components/close-button/close-button';
import * as styles from './related-list.scss';

/**
 * Contains related list header text and button to toggle the list off.
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
