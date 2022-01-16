import * as styles from './pagination-arrow.scss';
const {Icon, IconState} = KalturaPlayer.ui.components;

const ARROW_LEFT_PATH =
  'M12.2929 9.29289C11.9324 9.65338 11.9047 10.2206 12.2097 10.6129L12.2929 10.7071L17.585 16L12.2929 21.2929C11.9324 21.6534 11.9047 22.2206 12.2097 22.6129L12.2929 22.7071C12.6534 23.0676 13.2206 23.0953 13.6129 22.7903L13.7071 22.7071L19.7071 16.7071C20.0676 16.3466 20.0953 15.7794 19.7903 15.3871L19.7071 15.2929L13.7071 9.29289C13.3166 8.90237 12.6834 8.90237 12.2929 9.29289Z';

const ARROW_RIGHT_PATH =
  'M19.7071 9.29289C20.0676 9.65338 20.0953 10.2206 19.7903 10.6129L19.7071 10.7071L14.415 16L19.7071 21.2929C20.0676 21.6534 20.0953 22.2206 19.7903 22.6129L19.7071 22.7071C19.3466 23.0676 18.7794 23.0953 18.3871 22.7903L18.2929 22.7071L12.2929 16.7071C11.9324 16.3466 11.9047 15.7794 12.2097 15.3871L12.2929 15.2929L18.2929 9.29289C18.6834 8.90237 19.3166 8.90237 19.7071 9.29289Z';

const PaginationArrow = ({onClick, disabled, id, path}: {onClick: () => void; disabled: boolean; id: string; path: string}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`${KalturaPlayer.ui.style.controlButton} ${KalturaPlayer.ui.style.active} ${styles.paginationArrow} ${
        disabled ? styles.disabled : ''
      }`}>
      <Icon
        activeColor={KalturaPlayer.ui.style.white}
        color={'#888'}
        id={id}
        path={path}
        state={disabled ? IconState.INACTIVE : IconState.ACTIVE}
        viewBox={`0 0 32 32`}
      />
    </div>
  );
};

const ArrowRight = ({onClick, disabled}: {onClick: () => void; disabled: boolean}) => {
  return <PaginationArrow onClick={onClick} disabled={disabled} id={'related-arrow-right'} path={ARROW_RIGHT_PATH} />;
};

const ArrowLeft = ({onClick, disabled}: {onClick: () => void; disabled: boolean}) => {
  return <PaginationArrow onClick={onClick} disabled={disabled} id={'related-arrow-left'} path={ARROW_LEFT_PATH} />;
};

export {ArrowLeft, ArrowRight};
