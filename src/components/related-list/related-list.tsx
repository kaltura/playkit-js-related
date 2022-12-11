const {withText} = KalturaPlayer.ui.preacti18n;
const {PLAYER_SIZE} = KalturaPlayer.ui.components;

import {CloseButton, RelatedContext, Scrollable} from 'components';
import {getListEntry} from 'components/related-grid/grid-utils';
import {RelatedManager} from 'related-manager';

import * as styles from './related-list.scss';

import {ImageService} from 'services';

const RelatedList = withText({
  relatedVideosText: 'related.relatedVideos'
})(({relatedManager, imageService, relatedVideosText}: {relatedManager: RelatedManager; imageService: ImageService; relatedVideosText: string}) => {
  const data = relatedManager.entries;
  const entries = [];

  for (let i = 0; i < data.length; ++i) {
    const entryData = data[i];
    entries.push(entryData ? getListEntry(PLAYER_SIZE.MEDIUM, entryData) : <></>);
  }

  return (
    <div className={styles.relatedList}>
      <RelatedContext.Provider value={{relatedManager, imageService}}>
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
