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

/**
 * Displays related entries in horizontal or vertical list.
 *
 * @typedef RelatedList
 * @param {object} props Component props.
 * @param {RelatedManager} relatedManager Related manager instance.
 * @param {string} relatedVideosText Related videos label text.
 * @param {boolean} isVertical Indicates whether the list is vertical.
 */
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
    <div className={`${styles.relatedList}`}>
      <RelatedContext.Provider value={{relatedManager}}>
        <div className={styles.header}>
          <div className={styles.title}>{relatedVideosText}</div>
          <CloseButton
            onClick={() => {
              relatedManager.updateListVisibility(false, true);
            }}
          />
        </div>
        <Scrollable isVertical={isVertical}>{entries}</Scrollable>
      </RelatedContext.Provider>
    </div>
  );
});

export {RelatedList};
