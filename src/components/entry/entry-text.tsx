import {MultilineText} from 'components/multiline-text/multiline-text';
import * as styles from './entry.scss';

const EntryText = ({text}: {text: string}) => {
  return (
    <>
      {text ? (
        <div className={styles.entryText}>
          <MultilineText text={text} lineHeight={18} lines={2} />
        </div>
      ) : undefined}
    </>
  );
};

export {EntryText};
