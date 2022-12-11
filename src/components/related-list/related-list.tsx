import {useRef, useState} from 'preact/hooks';

const {withText} = KalturaPlayer.ui.preacti18n;
const {PLAYER_SIZE} = KalturaPlayer.ui.components;

import {CloseButton, RelatedContext} from 'components';
import {RelatedManager} from 'related-manager';

import * as styles from './related-list.scss';

import {getListEntry} from 'components/related-grid/grid-utils';
import {ImageService} from 'services';

const SCROLL_BAR_TIMEOUT = 250;

const RelatedList = withText({
  relatedVideosText: 'related.relatedVideos'
})(({relatedManager, imageService, relatedVideosText}: {relatedManager: RelatedManager; imageService: ImageService; relatedVideosText: string}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [scrolling, setScrolling] = useState(false);
  const [scrollTimeoutId, setScrollTimeoutId] = useState(-1);

  const data = relatedManager.entries;
  const entries = [];

  for (let i = 0; i < data.length; ++i) {
    const entryData = data[i];
    entries.push(entryData ? getListEntry(PLAYER_SIZE.MEDIUM, entryData) : <></>);
  }

  const handleScroll = () => {
    clearTimeout(scrollTimeoutId);
    setScrolling(true);
    setScrollTimeoutId(
      window.setTimeout(() => {
        setScrolling(false);
      }, SCROLL_BAR_TIMEOUT)
    );
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (contentRef?.current) {
      contentRef.current.scrollTop += e.deltaY;
      handleScroll();
    }
  };

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
        {/* <Scrollbar> */}
        <div className={`${styles.content} ${scrolling ? styles.scrolling : ''}`} ref={contentRef} onScroll={handleScroll} onWheel={handleWheel}>
          {entries}
        </div>
        {/* </Scrollbar> */}
      </RelatedContext.Provider>
    </div>
  );
});

export {RelatedList};
