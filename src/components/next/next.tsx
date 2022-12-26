const {PrevNext} = KalturaPlayer.ui.components;
import {useState, useEffect} from 'preact/hooks';
interface NextProps {
  showPreview: boolean;
  onClick: (cb: () => void) => void;
  onLoaded: (cb: (nextEntries: []) => void) => void;
  onUnloaded: (cb: (nextEntries: []) => void) => void;
}

/**
 * play next entry button
 *
 * @param {object} props component props
 * @param {boolean} props.showPreview indicates whether next entry preview should be visible
 * @param {Function} props.onLoaded handler for the component being loaded
 * @param {Function} props.onUnloaded handler for the component being unloaded
 * @param {Function} props.onClick handler for button click
 * @returns {NextProps} play next entry button component
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
