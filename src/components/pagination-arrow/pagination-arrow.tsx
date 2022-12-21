const {withText} = KalturaPlayer.ui.preacti18n;
const {Icon} = KalturaPlayer.ui.components;
import {Icon as IconPath} from 'types';

enum ARROW_TYPE {
  LEFT = 'left',
  RIGHT = 'right'
}

interface PaginationArrowProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: ARROW_TYPE;
  prev?: string;
  next?: string;
}

const DISABLED_COLOR = '#888';

const PaginationArrow = withText({
  prev: 'playlist.prev',
  next: 'playlist.next'
})(({onClick, disabled, type, prev, next}: PaginationArrowProps) => {
  return (
    <button
      tabIndex={0}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{cursor: disabled ? 'default' : 'pointer'}}
      className={`${KalturaPlayer.ui.style.controlButton} ${KalturaPlayer.ui.style.active}`}
      aria-label={type === ARROW_TYPE.LEFT ? prev : next}>
      <Icon
        color={disabled ? DISABLED_COLOR : KalturaPlayer.ui.style.white}
        id={`related-arrow-${type}-${disabled ? 'disabled' : ''}`}
        path={type === ARROW_TYPE.LEFT ? IconPath.ARROW_LEFT : IconPath.ARROW_RIGHT}
        viewBox={`0 0 32 32`}
      />
    </button>
  );
});

const ArrowLeft = ({onClick}: PaginationArrowProps) => <PaginationArrow onClick={onClick} disabled={false} type={ARROW_TYPE.LEFT} />;
const ArrowLeftDisabled = () => <PaginationArrow disabled={true} type={ARROW_TYPE.LEFT} />;
const ArrowRight = ({onClick}: PaginationArrowProps) => <PaginationArrow onClick={onClick} disabled={false} type={ARROW_TYPE.RIGHT} />;
const ArrowRightDisabled = () => <PaginationArrow disabled={true} type={ARROW_TYPE.RIGHT} />;

export {ArrowLeft, ArrowLeftDisabled, ArrowRight, ArrowRightDisabled};
