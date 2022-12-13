import {RelatedContext} from 'components';
import {useState, useEffect, useContext} from 'preact/hooks';
import * as styles from './thumbnail.scss';

const Thumbnail = ({poster = '', width, height}: {poster?: string; width: number; height: number}) => {
  const {relatedManager} = useContext(RelatedContext);
  const [src, setSrc] = useState('');

  useEffect(() => {
    relatedManager?.getImageUrl(poster, width, height).then((imageUrl: string | null) => setSrc(imageUrl || ''));
  }, [relatedManager, poster, width, height]);

  return src ? <img src={src} style={{width, height}} alt="" /> : <div className={styles.noImage} style={{width, height}} />;
};

export {Thumbnail};
