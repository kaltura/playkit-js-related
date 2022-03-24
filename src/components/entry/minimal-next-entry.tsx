import {GridEntryProps} from './grid-entry';
import {BaseNextEntry} from './base-next-entry';
import {MultilineText} from 'components/multiline-text/multiline-text';

import * as styles from './entry.scss';

const MinimalNextEntry = (props: GridEntryProps) => {
  const {entryDimensions} = props;
  const {width, contentHeight} = entryDimensions;

  return (
    <BaseNextEntry {...props}>
      <div className={`${styles.entryContent}`} style={{width, height: contentHeight}}>
        <div className={styles.text}>{props.title ? <MultilineText text={props.title} lineHeight={18} lines={1} /> : <></>}</div>
      </div>
    </BaseNextEntry>
  );
};

export {MinimalNextEntry};
