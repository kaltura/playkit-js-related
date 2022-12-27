const {PrevNext} = KalturaPlayer.ui.components;
import {useState, useEffect} from 'preact/hooks';
interface NextProps {
  showPreview: boolean;
  onClick: (cb: () => void) => void;
  onLoaded: (cb: (nextEntries: []) => void) => void;
  onUnloaded: (cb: (nextEntries: []) => void) => void;
}

/**
 * Play next entry button.
 *
 * @param {object} props Component props.
 * @param {boolean} props.showPreview Indicates whether next entry preview should be visible.
 * @param {Function} props.onLoaded Handler for component loaded event.
 * @param {Function} props.onUnloaded Handler for component loaded event.
 * @param {Function} props.onClick onClick event handler.
 */

const Next = (props: NextProps) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line jsdoc/require-jsdoc
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
