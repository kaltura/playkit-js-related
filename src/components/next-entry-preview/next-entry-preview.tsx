import {useContext} from 'preact/hooks';

import {EntryImage} from 'components/entry-image/entry-image';
import {Sources} from 'types/sources';

const {Icon, IconType} = KalturaPlayer.ui.components;

import {RelatedContext} from 'components/related-context/related-context';

import * as styles from './next-entry-preview.scss';

const NextEntryPreview = ({data}: {data: Sources; countdown: number}) => {
  const {relatedManager} = useContext(RelatedContext);

  return (
    <div className={styles.entryPreview}>
      <div className={styles.upNextText}>Up Next</div>
      <div className={styles.titleText}>{data.metadata?.name}</div>
      <div className={styles.main}>
        <div className={styles.entryImageContainer}>
          <EntryImage {...{src: data.poster, duration: data.duration, type: data.type, width: 129, height: 72}} />
        </div>
        <div className={styles.controls}>
          <div className={`${styles.control} ${styles.play}`} onClick={() => relatedManager?.playNext()}>
            <div className={styles.playContent}>
              <div className={styles.playIcon}>
                <Icon type={IconType.Play} />
              </div>
              <div className={styles.playText}>Play</div>
            </div>
          </div>
          <div className={`${styles.control} ${styles.cancel}`}>
            <div className={styles.cancelText}>Cancel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {NextEntryPreview};
