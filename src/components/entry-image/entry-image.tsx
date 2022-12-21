import {ComponentChildren} from 'preact';

import {DurationLabel} from 'components/duration-label/duration-label';
import {Thumbnail} from 'components/thumbnail/thumbnail';

import * as styles from '../entry/entry.scss';

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
    <div className={styles.entryImage} style={{height}}>
      {children}
      <div className={styles.thumbnail}>
        <Thumbnail poster={poster} width={width} height={height} />
      </div>
      <div className={styles.duration}>
        <DurationLabel type={type} duration={duration} />
      </div>
    </div>
  );
};

export {EntryImage};
