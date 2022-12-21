const {withText} = KalturaPlayer.ui.preacti18n;
const {Icon, Tooltip} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

const CloseButton = withText({
  closeText: 'overlay.close'
})(({onClick, closeText}: {closeText: string; onClick: () => void}) => {
  return (
    <div>
      <Tooltip label={closeText}>
        <button aria-label={closeText} tabIndex={0} className={`${KalturaPlayer.ui.style.controlButton}`} onClick={onClick}>
          <Icon id={`related-close-icon`} path={IconPath.CLOSE} viewBox={`0 0 32 32`} />
        </button>
      </Tooltip>
    </div>
  );
});

export {CloseButton};
