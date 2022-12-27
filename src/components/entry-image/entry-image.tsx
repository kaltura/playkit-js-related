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
 * entry image with a duration label
 *
 * @param {object} props entry image props
 * @param {string} props.poster entry thumbnail url
 * @param {string} props.type entry type
 * @param {number} props.duration entry duration
 * @param {number} props.width image width
 * @param {number} props.height image height
 * @param {object} props.children child components
 * @returns {object} entry image component
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
