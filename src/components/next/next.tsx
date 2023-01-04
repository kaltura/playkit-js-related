const {PrevNext} = KalturaPlayer.ui.components;
import {useState, useEffect} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {RelatedEvent, Sources} from 'types';
interface NextProps {
  showPreview: boolean;
  onClick: (cb: () => void) => void;
  relatedManager: RelatedManager;
}

const Next = ({showPreview, onClick, relatedManager}: NextProps) => {
  const [entries, setEntries] = useState<Sources[]>([]);

  useEffect(() => {
    function onEntriesChanged({payload}: {payload: Sources[]}) {
      setEntries(payload);
    }

    relatedManager.listen(RelatedEvent.RELATED_ENTRIES_CHANGED, onEntriesChanged);
    setEntries(relatedManager.entries);

    return () => {
      relatedManager.unlisten(RelatedEvent.RELATED_ENTRIES_CHANGED, onEntriesChanged);
    };
  }, []);

  return entries.length ? <PrevNext type={'next'} item={{sources: entries[0]}} onClick={onClick} showPreview={showPreview} /> : <></>;
};

export {Next};
