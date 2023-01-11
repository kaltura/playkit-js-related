import {RelatedContext} from 'components';
import {useState, useEffect, useContext} from 'preact/hooks';
import * as styles from './thumbnail.scss';

const DUMMY_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAYAAAA6yNxSAAAAJklEQVR42u3OMQEAAAgDoJnc6BpjDyRgLrcpGgEBAQEBAQGBduABaVYs3Q5APwQAAAAASUVORK5CYII=';

/**
 * Image with fixed dimensions and a fallback option for images which failed to load.
 *
 * @param {object} props Component props.
 * @param {string} props.poster Base image url.
 */

const Thumbnail = ({poster = ''}: {poster?: string}) => {
  const {relatedManager} = useContext(RelatedContext);
  const [src, setSrc] = useState('');

  useEffect(() => {
    relatedManager?.getImageUrl(poster).then((imageUrl: string | null) => setSrc(imageUrl || ''));
  }, [relatedManager, poster]);

  // use a hidden image so that even blank entries would have dimensions
  return (
    <div style={{backgroundImage: `url('${src}')`}} className={styles.thumbnail}>
      <img src={`${DUMMY_IMG}`} />
    </div>
  );
};

export {Thumbnail};
