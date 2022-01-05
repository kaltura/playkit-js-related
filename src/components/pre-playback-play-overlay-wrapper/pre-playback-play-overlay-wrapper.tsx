const { PrePlaybackPlayOverlay, Remove } = KalturaPlayer.ui.components;
const { connect } = KalturaPlayer.ui.redux;

const mapStateToProps = (state: any) => {
  return {
    isPlaybackEnded: state.engine.isPlaybackEnded
  };
};
const PrePlaybackPlayOverlayWrapper = ({
  isPlaybackEnded
}: {
  isPlaybackEnded: boolean;
}) => {
  return isPlaybackEnded ? <Remove /> : <PrePlaybackPlayOverlay />;
};

export default connect(mapStateToProps)(PrePlaybackPlayOverlayWrapper);
