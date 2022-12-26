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
 * displays related entries in horizontal or vertical list
 *
 * @param {object} props component props
 * @param {RelatedManager} relatedManager related manager instance
 * @param {string} relatedVideosText related videos label text
 * @param {boolean} isVertical indicates whether the list is vertical
 * @returns {*} related list component
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
