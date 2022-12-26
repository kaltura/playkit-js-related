const {withText} = KalturaPlayer.ui.preacti18n;
const {Icon, Tooltip} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

/**
 * close button
 *
 * @param {object} props close button props
 * @param {Function} props.onClick button click handler
 * @param {string} props.closeText button label
 * @returns {*} close button component
 */
const CloseButton = withText({
  closeText: 'overlay.close'
})(({onClick, closeText}: {onClick: () => void; closeText: string}) => {
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
