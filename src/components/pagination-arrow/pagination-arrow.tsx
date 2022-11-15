const {withText} = KalturaPlayer.ui.preacti18n;
const {Icon, IconState} = KalturaPlayer.ui.components;

enum ARROW_TYPE {
  LEFT = 'left',
  RIGHT = 'right'
}

interface PaginationArrowProps {
  onClick: () => void;
  disabled: boolean;
  type?: ARROW_TYPE;
  prev?: string;
  next?: string;
}

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
        activeColor={KalturaPlayer.ui.style.white}
        color={'#888'}
        id={`related-arrow-${type}`}
        path={type === ARROW_TYPE.LEFT ? Icon.ARROW_LEFT : Icon.ARROW_RIGHT}
        state={disabled ? IconState.INACTIVE : IconState.ACTIVE}
        viewBox={`0 0 32 32`}
      />
    </button>
  );
});

const ArrowLeft = ({onClick, disabled}: PaginationArrowProps) => <PaginationArrow onClick={onClick} disabled={disabled} type={ARROW_TYPE.LEFT} />;

const ArrowRight = ({onClick, disabled}: PaginationArrowProps) => <PaginationArrow onClick={onClick} disabled={disabled} type={ARROW_TYPE.RIGHT} />;

export {ArrowLeft, ArrowRight};
