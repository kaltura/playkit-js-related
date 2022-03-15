import {ComponentChildren} from 'preact';
import {useContext, useEffect} from 'preact/hooks';

import {GridEntryProps} from './grid-entry';
import {Timer} from 'components/timer/timer';
import {RelatedContext} from 'components/related-context/related-context';
import {EntryImage} from 'components/entry-image/entry-image';

import * as styles from './entry.scss';

interface NextEntryProps extends GridEntryProps {
  description?: string;
  countdown?: number;
  children?: ComponentChildren;
}

const BaseNextEntry = (props: NextEntryProps) => {
  const {relatedManager} = useContext(RelatedContext);
  const {id, duration, type, poster, entryDimensions} = props;
  const {width, imageHeight} = entryDimensions;

  useEffect(() => {
    if (props.countdown && props.countdown !== -1) {
      setTimeout(() => {
        relatedManager?.playNext();
      }, props.countdown * 1000);
    }
  }, [props.countdown]);

  return (
    <div
      className={`${styles.entry} ${styles.nextEntry}`}
      style={{width, color: KalturaPlayer.ui.style.white}}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}>
      <EntryImage {...{poster, duration, type, width, height: imageHeight}}>
        {props.countdown && props.countdown !== -1 ? (
          <div className={styles.timer}>
            <Timer seconds={props.countdown} />
          </div>
        ) : (
          <></>
        )}
      </EntryImage>
      {props.children}
    </div>
  );
};

export {BaseNextEntry};
