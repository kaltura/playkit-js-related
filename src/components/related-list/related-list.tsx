import {useState, useEffect} from 'preact/hooks';

const {withText} = KalturaPlayer.ui.preacti18n;
const {PLAYER_SIZE} = KalturaPlayer.ui.components;

import {CloseButton, RelatedContext, Scrollable} from 'components';
import {ListEntryPlaceholder} from 'components/entry/list-entry-placeholder';
import {getListEntry} from 'components/related-grid/grid-utils';
import {RelatedManager} from 'related-manager';

import * as styles from './related-list.scss';
import {Sources} from 'types';

const RelatedList = withText({
  relatedVideosText: 'related.relatedVideos'
})(({relatedManager, relatedVideosText}: {relatedManager: RelatedManager; relatedVideosText: string}) => {
  const [finishedLoading, setFinishedLoading] = useState(false);

  useEffect(() => {
    Promise.all(
      relatedManager.entries.map((entry: Sources | null) => {
        return entry?.poster ? relatedManager.getImageUrl(entry.poster, 99, 56) : Promise.resolve();
      })
    ).then(() => {
      setFinishedLoading(true);
    });
  }, [relatedManager]);

  let entries = [];
  if (finishedLoading) {
    entries = relatedManager.entries.map(entry => (entry ? getListEntry(PLAYER_SIZE.MEDIUM, entry) : <></>));
  } else {
    entries = new Array(relatedManager.entries.length).fill(<ListEntryPlaceholder />);
  }

  return (
    <div className={styles.relatedList}>
      <RelatedContext.Provider value={{relatedManager}}>
        <div className={styles.header}>
          <div className={styles.title}>{relatedVideosText}</div>
          <CloseButton
            onClick={() => {
              relatedManager.isListVisible = false;
            }}
          />
        </div>
        <Scrollable>{entries}</Scrollable>
      </RelatedContext.Provider>
    </div>
  );
});

export {RelatedList};
