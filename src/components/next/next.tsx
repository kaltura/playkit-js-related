const {PrevNext} = KalturaPlayer.ui.components;
const {withEventManager} = KalturaPlayer.ui.Event;

import {RelatedInternalEvent} from 'event';
import {useState, useEffect} from 'preact/hooks';
import {RelatedManager} from 'related-manager';
import {Sources} from 'types';
interface NextProps {
  relatedManager: RelatedManager;
  showPreview: boolean;
  onClick: (cb: () => void) => void;
  eventManager: KalturaPlayerTypes.EventManager;
  eventContext: KalturaPlayerTypes.FakeEventTarget;
}

/**
 * Play next entry button.
 *
 * @param {object} props Component props.
 * @param {RelatedManager} props.relatedManager Related manager instance.
 * @param {boolean} props.showPreview Indicates whether next entry preview should be visible.
 * @param {Function} props.onClick onClick event handler.
 * @param {object} props.eventManager Component event manager.
 * @param {object} props.eventContext Event context.
 */

const Next = withEventManager(({relatedManager, showPreview, onClick, eventManager, eventContext}: NextProps) => {
  const [entries, setEntries] = useState<Sources[]>([]);

  useEffect(() => {
    eventManager.listen(eventContext, RelatedInternalEvent.RELATED_ENTRIES_CHANGED, ({payload}: {payload: Sources[]}) => {
      setEntries(payload);
    });

    setEntries(relatedManager.entries);
  }, []);

  return entries.length ? <PrevNext type={'next'} item={{sources: entries[0]}} onClick={onClick} showPreview={showPreview} /> : <></>;
});

export {Next};
