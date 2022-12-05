import {RelatedContext} from 'components/related-context/related-context';
import {useState, useEffect, useContext} from 'preact/hooks';
import * as styles from './thumbnail.scss';

const Thumbnail = ({poster = '', width, height}: {poster?: string; width: number; height: number}) => {
  const {imageService} = useContext(RelatedContext);
  const [src, setSrc] = useState('');

  useEffect(() => {
    imageService?.getImageUrl(poster, width, height).then((imageUrl: string | null) => setSrc(imageUrl || ''));
  }, [imageService, poster, width, height]);

  return src ? <img className={styles.image} src={src} style={{width, height}} alt="" /> : <div className={styles.noImage} style={{width, height}} />;
};

export {Thumbnail};
