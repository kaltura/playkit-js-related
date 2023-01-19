import {ComponentChildren} from 'preact';

import {DurationLabel} from 'components/duration-label/duration-label';
import {Thumbnail} from 'components/thumbnail/thumbnail';

import * as styles from '../entry/entry.scss';

interface EntryImageProps {
  poster?: string;
  type: KalturaPlayerTypes.EntryTypes;
  duration?: number;
  height?: number;
  width?: number;
  children?: ComponentChildren;
}

/**
 * Entry image with a duration label.
 *
 * @param {object} props Component props.
 * @param {string} props.poster Entry thumbnail url.
 * @param {string} props.type Entry type.
 * @param {number} props.duration Entry playback duration.
 * @param {number} props.height Entry image height.
 * @param {number} props.width Entry image width.
 * @param {object} props.children Child components.
 */

const EntryImage = ({poster, type, duration, height, width, children}: EntryImageProps) => {
  return (
    <div className={styles.entryImage}>
      {children}
      <div style={{height: height || '', width: width || ''}} className={styles.thumbnailWrapper}>
        <Thumbnail poster={poster} />
      </div>
      <div className={styles.duration}>
        <DurationLabel type={type} duration={duration} />
      </div>
    </div>
  );
};

export {EntryImage};
