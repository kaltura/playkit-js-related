import {RelatedContext} from 'components/related-context/related-context';
import {ComponentChildren} from 'preact';
import {useContext, useState} from 'preact/hooks';
import {EntryType} from './entry-type';
import * as styles from './entry.scss';

const {withText} = KalturaPlayer.ui.preacti18n;
const {toHHMMSS} = KalturaPlayer.ui.utils;
interface EntryProps {
  id: string;
  children?: ComponentChildren;
  duration?: number;
  type?: string;
  imageUrl?: string;
  width: number;
  imageHeight: number;
  contentHeight: number;
  liveText?: string;
}

const Entry = withText({
  liveText: 'controls.live'
})(({id, children, duration, type, imageUrl, width, imageHeight, contentHeight, liveText}: EntryProps) => {
  const {relatedManager} = useContext(RelatedContext);
  const [showImage, setShowImage] = useState(true);
  const [useImageDimensions, setUseImageDimensions] = useState(true);

  let image;
  if (!showImage) {
    image = <div className={styles.noImage} style={{width, height: imageHeight}} />;
  } else if (useImageDimensions) {
    image = (
      <img
        className={styles.image}
        src={`${imageUrl}/width/${width}/height/${imageHeight}`}
        style={{width, height: imageHeight}}
        onError={() => {
          setUseImageDimensions(false);
        }}
      />
    );
  } else {
    image = (
      <img
        className={styles.image}
        src={imageUrl}
        style={{width, height: imageHeight}}
        onError={() => {
          setShowImage(false);
        }}
      />
    );
  }

  const color = KalturaPlayer.ui.style.white;
  let entryDuration;

  if (type === EntryType.LIVE) {
    entryDuration = (
      <div className={`${styles.duration} ${styles.live}`}>
        <span className={styles.durationText}>{liveText}</span>
      </div>
    );
  } else if (duration) {
    entryDuration = (
      <div className={styles.duration}>
        <span className={styles.durationText}>{toHHMMSS(duration)}</span>
      </div>
    );
  }

  return (
    <div
      className={styles.entry}
      style={{width, color}}
      onClick={() => {
        relatedManager?.playSelected(id);
      }}>
      {image}
      {entryDuration}
      <div className={styles.entryContent} style={{width, height: contentHeight}}>
        {children}
      </div>
    </div>
  );
});

export {Entry, EntryProps};
