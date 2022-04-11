const {PrevNext} = KalturaPlayer.ui.components;
import {useState, useEffect} from 'preact/hooks';
interface NextProps {
  showPreview: boolean;
  onClick: (cb: () => void) => void;
  onLoaded: (cb: (nextEntries: []) => void) => void;
  onUnloaded: (cb: (nextEntries: []) => void) => void;
}

const Next = (props: NextProps) => {
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

  return entries.length ? <PrevNext type={'next'} item={{sources: entries[0]}} onClick={props.onClick} showPreview={props.showPreview} /> : <></>;
};

export {Next};
