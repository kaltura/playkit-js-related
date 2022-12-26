import {RelatedContext} from 'components';
import {useState, useEffect, useContext} from 'preact/hooks';
import * as styles from './thumbnail.scss';

/**
 * image with fixed domensions and a fallback option for images which failed to load
 *
 * @param {object} props thumbnail props
 * @param {string} props.poster the base image url
 * @param {number} props.width image width
 * @param {number} props.height image height
 * @returns {object} thumbnail component
 */
const Thumbnail = ({poster = '', width, height}: {poster?: string; width: number; height: number}) => {
  const {relatedManager} = useContext(RelatedContext);
  const [src, setSrc] = useState('');

  useEffect(() => {
    relatedManager?.getImageUrl(poster).then((imageUrl: string | null) => setSrc(imageUrl || ''));
  }, [relatedManager, poster, width, height]);

  return src ? <img src={src} style={{width, height}} alt="" /> : <div className={styles.noImage} style={{width, height}} />;
};

export {Thumbnail};
