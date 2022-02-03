import {RelatedContext} from 'components/related-context/related-context';
import {ComponentChildren} from 'preact';
import {useContext, useState} from 'preact/hooks';
import * as styles from './entry.scss';

const {toHHMMSS} = KalturaPlayer.ui.utils;
interface EntryProps {
  id: string;
  children?: ComponentChildren;
  duration?: number;
  isLive?: boolean;
  imageUrl?: string;
  width: number;
  imageHeight: number;
  contentHeight: number;
}

const Entry = ({id, children, duration, imageUrl, width, imageHeight, contentHeight}: EntryProps) => {
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
  const entryDuration = duration ? (
    <div className={styles.duration}>
      <span className={styles.durationText}>{toHHMMSS(duration)}</span>
    </div>
  ) : undefined;

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
};

export {Entry, EntryProps};
