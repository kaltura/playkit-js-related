import {ComponentChildren} from 'preact';
import {useContext, useEffect, useState} from 'preact/hooks';
const {withText} = KalturaPlayer.ui.preacti18n;

import {GridEntryProps} from './grid-entry';
import {RelatedContext} from 'components/related-context/related-context';
import {EntryImage} from 'components/entry-image/entry-image';

import * as styles from './entry.scss';

interface NextEntryProps extends GridEntryProps {
  description?: string;
  countdown: number;
  children?: ComponentChildren;
  sizeClass: string;
  cancelLabel: string;
  playNowLabel: string;
  alwaysShowButtons: boolean;
  onCancel: () => void;
}

const BaseNextEntry = withText({
  playNowLabel: 'related.playNow',
  cancelLabel: 'playlist.cancel'
})((props: NextEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const {duration, type, poster, entryDimensions, countdown, sizeClass, playNowLabel, cancelLabel, alwaysShowButtons, onCancel = () => {}} = props;
  const {width, imageHeight} = entryDimensions;

  const [animated, setAnimated] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [timeoutId, setTimeoutId] = useState(-1);

  useEffect(() => {
    if (countdown > 0 && showButtons) {
      setAnimated(true);
      setTimeoutId(
        window.setTimeout(() => {
          relatedManager?.playNext();
          setAnimated(false);
        }, countdown * 1000)
      );
    }
  }, [countdown, showButtons]);

  const onPlayNowClick = (e: MouseEvent) => {
    e.stopPropagation();
    relatedManager?.playNext();
    clearTimeout(timeoutId);
    setTimeoutId(-1);
  };

  const onCancelClick = (e: MouseEvent) => {
    e.stopPropagation();
    setAnimated(false);
    setShowButtons(false);
    clearTimeout(timeoutId);
    setTimeoutId(-1);
    onCancel();
  };

  const onEntryClick = () => {
    if (!(countdown > 0 && showButtons)) {
      relatedManager?.playNext();
    }
  };

  return (
    <button
      tabIndex={0}
      className={`${styles.entry} ${styles.nextEntry} ${sizeClass}`}
      style={{width, color: KalturaPlayer.ui.style.white}}
      disabled={alwaysShowButtons || (countdown > 0 && showButtons)}
      onClick={onEntryClick}>
      <EntryImage {...{poster, duration, type, width, height: imageHeight}}>
        {alwaysShowButtons || (countdown > 0 && showButtons) ? (
          <div className={styles.buttons}>
            <button
              tabIndex={0}
              className={`${styles.button} ${styles.playNow} ${animated ? styles.animated : ''}`}
              onClick={onPlayNowClick}
              style={{
                background: KalturaPlayer.ui.style.brandColor
              }}>
              <div className={styles.animation} style={{'animation-duration': `${countdown}s`}} />
              <div className={styles.buttonText}>{playNowLabel}</div>
            </button>
            <button tabIndex={0} className={`${styles.button} ${styles.cancel}`} onClick={onCancelClick}>
              <div className={styles.buttonText}>{cancelLabel}</div>
            </button>
          </div>
        ) : (
          <></>
        )}
      </EntryImage>
      {props.children}
    </button>
  );
});

export {BaseNextEntry};
