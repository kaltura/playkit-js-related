import {useState, useEffect} from 'preact/hooks';
import * as styles from './thumbnail.scss';

const Thumbnail = ({src = '', height, width}: {src?: string; height: number; width: number}) => {
  const [showImage, setShowImage] = useState(!!src);
  const [thumbnailSrc, setThumbnailSrc] = useState(`${src}/width/${width}/height/${height}`);
  const [retryLoad, setRetryLoad] = useState(true);

  useEffect(() => {
    if (showImage) {
      const imageToLoad = new Image();
      imageToLoad.src = thumbnailSrc;
      imageToLoad.onerror = () => {
        if (retryLoad) {
          setRetryLoad(false);
          setThumbnailSrc(src);
        } else {
          setShowImage(false);
        }
      };
    }
  }, [showImage]);

  return showImage ? (
    <img className={styles.image} src={thumbnailSrc} style={{width, height}} />
  ) : (
    <div className={styles.noImage} style={{width, height}} />
  );
};

export {Thumbnail};
