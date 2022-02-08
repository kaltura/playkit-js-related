const {PrePlaybackPlayOverlay} = KalturaPlayer.ui.components;
const {connect} = KalturaPlayer.ui.redux;

const mapStateToProps = (state: any) => {
  return {
    isPlaybackEnded: state.engine.isPlaybackEnded
  };
};

interface PrePlaybackPlayOverlayWrapperProps {
  isPlaybackEnded: boolean;
  showOnPlaybackDone: boolean;
}

const PrePlaybackPlayOverlayWrapper = connect(mapStateToProps)(({isPlaybackEnded, showOnPlaybackDone}: PrePlaybackPlayOverlayWrapperProps) => {
  return isPlaybackEnded && showOnPlaybackDone ? undefined : <PrePlaybackPlayOverlay />;
});

export {PrePlaybackPlayOverlayWrapper};
