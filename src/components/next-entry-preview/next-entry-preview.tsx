import {useContext, useEffect, useState} from 'preact/hooks';

import {EntryImage} from 'components/entry-image/entry-image';
import {Sources} from 'types/sources';

const {Icon, IconType} = KalturaPlayer.ui.components;
const {withText} = KalturaPlayer.ui.preacti18n;

import {RelatedContext} from 'components/related-context/related-context';

import * as styles from './next-entry-preview.scss';
import {Countdown} from 'components/countdown/countdown';

interface NextEntryPreviewProps {
  data: Sources;
  countdown: number;
  cancel: string;
  play: string;
  upNext: string;
  upNextIn: string;
  onCancel: () => void;
}

const NextEntryPreview = withText({
  play: 'controls.play',
  cancel: 'playlist.cancel',
  upNext: 'playlist.up_next',
  upNextIn: 'related.upNextIn'
})(({data, countdown, play, cancel, upNext, upNextIn, onCancel}: NextEntryPreviewProps) => {
  const {relatedManager} = useContext(RelatedContext);
  const [timeoutHandle, setTimeoutHandle] = useState(-1);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const handle = window.setTimeout(() => {
        relatedManager?.playNext();
        setAnimated(false);
      }, countdown * 1000);
      setTimeoutHandle(handle);
      setAnimated(true);
    }
  }, [countdown]);

  const cancelTimeout = () => {
    setAnimated(false);
    clearTimeout(timeoutHandle);
    setTimeoutHandle(-1);
    onCancel();
  };

  return (
    <div className={styles.entryPreview}>
      <div className={styles.upNextText}>
        {animated ? (
          <span>
            {`${upNextIn} `}
            <Countdown seconds={countdown} />
          </span>
        ) : (
          <span>{upNext}</span>
        )}
      </div>
      <div className={styles.titleText}>{data.metadata?.name}</div>
      <div className={styles.main}>
        <div className={styles.entryImageContainer}>
          <EntryImage {...{src: data.poster, duration: data.duration, type: data.type, width: 129, height: 72}} />
        </div>
        <div className={styles.controls}>
          <div
            className={`${styles.control} ${styles.play} ${animated ? styles.animated : ''}`}
            onClick={() => relatedManager?.playNext()}
            style={{
              'transition-duration': `${countdown}s`
            }}>
            <div className={styles.playContent}>
              <div className={styles.playIcon}>
                <Icon type={IconType.Play} />
              </div>
              <div className={styles.playText}>{play}</div>
            </div>
          </div>
          <div className={`${styles.control} ${styles.cancel}`}>
            <div className={styles.cancelText} onClick={() => cancelTimeout()}>
              {cancel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export {NextEntryPreview};
