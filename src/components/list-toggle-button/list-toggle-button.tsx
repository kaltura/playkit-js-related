const {withText} = KalturaPlayer.ui.preacti18n;
const {Tooltip, Icon} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

import * as styles from './list-toggle-button.scss';

/**
 * Related list toggle button.
 *
 * @param {object} props Component props.
 * @param {boolean} props.disabled Disabled state indication.
 * @param {string} props.relatedVideosText Button label.
 */
const ListToggleButton = withText({
  relatedVideosText: 'related.relatedVideos'
})(({disabled, relatedVideosText}: {disabled: boolean; relatedVideosText: string}) => {
  return (
    <Tooltip label={relatedVideosText} type="bottom-left" strictPosition={true}>
      <button
        aria-label={relatedVideosText}
        tabIndex={0}
        disabled={disabled}
        className={`${styles.listToggleButton} ${KalturaPlayer.ui.style.upperBarIcon}`}>
        <Icon id={`related-toggle-icon`} path={IconPath.LIST_TOGGLE} viewBox={`0 0 32 32`} />
      </button>
    </Tooltip>
  );
});

export {ListToggleButton};
