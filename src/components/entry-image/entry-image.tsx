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

/**
 * Entry image with a duration label.
 *
 * @param {object} props Component props.
 * @param {string} props.poster Entry thumbnail url.
 * @param {string} props.type Entry type.
 * @param {number} props.duration Entry playback duration.
 * @param {number} props.width Image width.
 * @param {number} props.height Image height.
 * @param {object} props.children Child components.
 */

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
