const {Icon, IconState} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

import * as styles from './list-toggle-button.scss';

const ListToggleButton = ({active, disabled}: {active: boolean; disabled: boolean}) => {
  return (
    <button
      tabIndex={0}
      disabled={disabled}
      className={`${styles.listToggleButton} ${KalturaPlayer.ui.style.controlButton} ${KalturaPlayer.ui.style.upperBarIcon} ${
        active ? styles.active : ''
      }`}>
      <Icon
        activeColor={KalturaPlayer.ui.style.white}
        id={`related-toggle-icon`}
        path={IconPath.LIST_TOGGLE}
        state={IconState.ACTIVE}
        viewBox={`0 0 32 32`}
      />
    </button>
  );
};

export {ListToggleButton};
