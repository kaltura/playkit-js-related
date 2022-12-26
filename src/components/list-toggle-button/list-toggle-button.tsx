const {withText} = KalturaPlayer.ui.preacti18n;
const {Icon} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

import * as styles from './list-toggle-button.scss';

/**
 * related list toggle button
 *
 * @param {object} props related list toggle button props
 * @param {boolean} disabled button disabled state
 * @param {string} relatedVideosText button label
 * @returns {object} related list toggle button component
 */
const ListToggleButton = withText({
  relatedVideosText: 'related.relatedVideos'
})(({disabled, relatedVideosText}: {disabled: boolean; relatedVideosText: string}) => {
  return (
    <button
      aria-label={relatedVideosText}
      tabIndex={0}
      disabled={disabled}
      className={`${styles.listToggleButton} ${KalturaPlayer.ui.style.upperBarIcon}`}>
      <Icon id={`related-toggle-icon`} path={IconPath.LIST_TOGGLE} viewBox={`0 0 32 32`} />
    </button>
  );
});

export {ListToggleButton};
