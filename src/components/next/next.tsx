const {PrevNext, Tooltip} = KalturaPlayer.ui.components;
import {useState, useEffect} from 'preact/hooks';

const {withText} = KalturaPlayer.ui.preacti18n;

import * as styles from './next.scss';
interface NextProps {
  next: string;
  onClick: (cb: () => void) => void;
  onLoaded: (cb: (nextEntries: []) => void) => void;
  onUnloaded: (cb: (nextEntries: []) => void) => void;
}

const Next = withText({
  next: 'playlist.next'
})((props: NextProps) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    function onEntriesChanged(updatedEntries: []) {
      setEntries(updatedEntries);
    }

    props.onLoaded(onEntriesChanged);

    return () => {
      // clear listener on component unmount
      props.onUnloaded(onEntriesChanged);
    };
  }, []);

  return entries.length ? (
    <div className={styles.next}>
      <Tooltip label={props.next}>
        <PrevNext type={'next'} item={{sources: entries[0]}} onClick={props.onClick} />
      </Tooltip>
    </div>
  ) : (
    <></>
  );
});

export {Next};
