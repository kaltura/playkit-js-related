import {EntryImage} from 'components/entry-image/entry-image';
import {Sources} from 'types/sources';

const {Icon, IconType} = KalturaPlayer.ui.components;

import * as styles from './entry-preview.scss';

const EntryPreview = ({data}: {data: Sources; countdown: number}) => {
  return (
    <div className={styles.entryPreview}>
      <div className={styles.upNextText}>Up Next</div>
      <div className={styles.titleText}>{data.metadata?.name}</div>
      <div className={styles.main}>
        <EntryImage {...{src: data.poster, duration: data.duration, type: data.type, width: 129, height: 72}} />
        <div className={styles.controls}>
          <div className={`${styles.control} ${styles.play}`}>
            <div className={styles.playContent}>
              <div className={styles.playIcon}>
                <Icon type={IconType.Play} />
              </div>
              <div className={styles.playText}>Play</div>
            </div>
          </div>
          <div className={`${styles.control} ${styles.cancel}`}>
            <div className={styles.cancelContent}>Cancel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {EntryPreview};
