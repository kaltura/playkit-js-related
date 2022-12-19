import {useState, useEffect} from 'preact/hooks';

const {withText} = KalturaPlayer.ui.preacti18n;

import {CloseButton, RelatedContext, Scrollable} from 'components';
import {ListEntryPlaceholder} from 'components/entry/list-entry-placeholder';
import {getListEntry} from 'components/related-grid/grid-utils';
import {RelatedManager} from 'related-manager';

import * as styles from './related-list.scss';
import {Sources} from 'types';

interface RelatedListProps {
  relatedManager: RelatedManager;
  relatedVideosText: string;
  isVertical: boolean;
}

const RelatedList = withText({
  relatedVideosText: 'related.relatedVideos'
})(({relatedManager, relatedVideosText, isVertical}: RelatedListProps) => {
  const [finishedLoading, setFinishedLoading] = useState(false);
  let entries = [];

  useEffect(() => {
    Promise.all(
      relatedManager.entries.map((entry: Sources | null) => {
        return entry?.poster ? relatedManager.getImageUrl(entry.poster) : Promise.resolve();
      })
    ).then(() => {
      setFinishedLoading(true);
    });
  }, [relatedManager]);

  if (finishedLoading) {
    entries = relatedManager.entries.map(entry => (entry ? getListEntry(entry, isVertical) : <></>));
  } else {
    entries = new Array(relatedManager.entries.length).fill(<ListEntryPlaceholder isVertical={isVertical} />);
  }

  return (
    <div className={`${styles.relatedList} ${isVertical ? styles.vertical : styles.horizontal}`}>
      <RelatedContext.Provider value={{relatedManager}}>
        <div className={styles.header}>
          <div className={styles.title}>{relatedVideosText}</div>
          <CloseButton
            onClick={() => {
              relatedManager.isListVisible = false;
            }}
          />
        </div>
        <Scrollable isVertical={isVertical}>{entries}</Scrollable>
      </RelatedContext.Provider>
    </div>
  );
});

export {RelatedList};
