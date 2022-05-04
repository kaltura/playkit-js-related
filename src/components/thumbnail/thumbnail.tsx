import {RelatedContext} from 'components/related-context/related-context';
import {useState, useEffect, useContext} from 'preact/hooks';
import * as styles from './thumbnail.scss';

const Thumbnail = ({src = '', width, height}: {src?: string; width: number; height: number}) => {
  const {imageService} = useContext(RelatedContext);
  const [showImage, setShowImage] = useState(false);
  const [finalizedSrc, setFinalizedSrc] = useState('');

  useEffect(() => {
    imageService?.getImageUrl(src, width, height).then((imageUrl: string | null) => {
      if (imageUrl) {
        setFinalizedSrc(imageUrl);
        setShowImage(true);
      } else {
        setShowImage(false);
      }
    });
  }, [src, width, height]);

  return showImage ? (
    <img className={styles.image} src={finalizedSrc} style={{width, height}} alt="" />
  ) : (
    <div className={styles.noImage} style={{width, height}} />
  );
};

export {Thumbnail};
