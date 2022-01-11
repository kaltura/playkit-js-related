const { PrePlaybackPlayOverlay } = KalturaPlayer.ui.components;
const { connect } = KalturaPlayer.ui.redux;

const mapStateToProps = (state: any) => {
  return {
    isPlaybackEnded: state.engine.isPlaybackEnded
  };
};

const PrePlaybackPlayOverlayWrapper = connect(mapStateToProps)(
  ({ isPlaybackEnded }: { isPlaybackEnded: boolean }) => {
    return isPlaybackEnded ? undefined : <PrePlaybackPlayOverlay />;
  }
);

export { PrePlaybackPlayOverlayWrapper };
