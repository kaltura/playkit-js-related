const {PrevNext} = KalturaPlayer.ui.components;
import {useState, useEffect} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {RelatedEvent} from 'types/related-event';

const Next = ({relatedManager}: {relatedManager: RelatedManager}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function onEntriesChanged() {
      setIsVisible(!!relatedManager.entries.length);
    }

    relatedManager.listen(RelatedEvent.ENTRIES_CHANGED, onEntriesChanged);

    return () => {
      // clear listener on component unmount
      relatedManager.unlisten(RelatedEvent.ENTRIES_CHANGED, onEntriesChanged);
    };
  }, []);

  return isVisible ? (
    <PrevNext
      type={'next'}
      item={{sources: relatedManager?.entries[0]}}
      onClick={() => {
        relatedManager?.playNext();
      }}
    />
  ) : (
    <></>
  );
};

export {Next};
