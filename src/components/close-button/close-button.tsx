const {Icon, IconState} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as styles from './close-button.scss';

const CloseButton = ({onClick}: {onClick: () => void}) => {
  return (
    <button tabIndex={0} className={`${KalturaPlayer.ui.style.controlButton}`} onClick={onClick}>
      <Icon
        activeColor={KalturaPlayer.ui.style.white}
        id={`related-close-icon`}
        path={IconPath.CLOSE}
        state={IconState.ACTIVE}
        viewBox={`0 0 32 32`}
      />
    </button>
  );
};

export {CloseButton};
