const {PLAYER_SIZE} = KalturaPlayer.ui.components;

import {CloseButton, RelatedContext} from 'components';
import {RelatedManager} from 'related-manager';

import * as styles from './related-list.scss';
import * as entryStyle from '../entry/entry.scss';

import {getListEntry} from 'components/related-grid/grid-utils';
import {ImageService} from 'services';

const RelatedList = ({relatedManager, imageService}: {relatedManager: RelatedManager; imageService: ImageService}) => {
  const data = relatedManager.entries;
  const entries = [];

  for (let i = 0; i < data.length; ++i) {
    const entryData = data[i];
    entries.push(<div className={`${entryStyle.listEntry}`}>{entryData ? getListEntry(PLAYER_SIZE.MEDIUM, entryData) : <></>}</div>);
  }

  return (
    <div className={styles.relatedList}>
      <RelatedContext.Provider value={{relatedManager, imageService}}>
        <div className={styles.header}>
          <div className={styles.title}>Related Videos</div>
          <CloseButton
            onClick={() => {
              relatedManager.isListVisible = false;
            }}
          />
        </div>
        <div className={styles.content}>{entries}</div>
      </RelatedContext.Provider>
    </div>
  );
};

export {RelatedList};