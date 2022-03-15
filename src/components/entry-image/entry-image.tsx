import {ComponentChildren} from 'preact';

import {DurationLabel} from 'components/duration-label/duration-label';
import {Thumbnail} from 'components/thumbnail/thumbnail';

import * as styles from './entry-image.scss';

interface EntryImageProps {
  poster?: string;
  type: KalturaPlayerTypes.EntryTypes;
  duration?: number;
  width: number;
  height: number;
  children?: ComponentChildren;
}

const EntryImage = ({poster, type, duration, width, height, children}: EntryImageProps) => {
  return (
    <div className={styles.entryImage}>
      {children}
      <Thumbnail src={poster} width={width} height={height} />
      <div className={styles.duration}>
        <DurationLabel type={type} duration={duration} />
      </div>
    </div>
  );
};

export {EntryImage};
