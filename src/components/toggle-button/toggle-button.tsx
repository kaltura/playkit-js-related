const {Icon, IconState} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

const ToggleButton = ({active}: {active: boolean}) => {
  return (
    <button tabIndex={0} style={{cursor: 'pointer', background: active ? '#444' : ''}} className={`${KalturaPlayer.ui.style.controlButton}`}>
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

export {ToggleButton};
