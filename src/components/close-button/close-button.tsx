const {withText} = KalturaPlayer.ui.preacti18n;
const {Icon, IconState} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

const CloseButton = withText({
  closeText: 'overlay.close'
})(({onClick, closeText}: {closeText: string; onClick: () => void}) => {
  return (
    <button aria-label={closeText} tabIndex={0} className={`${KalturaPlayer.ui.style.controlButton}`} onClick={onClick}>
      <Icon
        activeColor={KalturaPlayer.ui.style.white}
        id={`related-close-icon`}
        path={IconPath.CLOSE}
        state={IconState.ACTIVE}
        viewBox={`0 0 32 32`}
      />
    </button>
  );
});

export {CloseButton};
