import {RelatedManager} from 'related-manager';

const {PrePlaybackPlayOverlay} = KalturaPlayer.ui.components;
const {connect} = KalturaPlayer.ui.redux;

const mapStateToProps = (state: any) => {
  return {
    isPlaybackEnded: state.engine.isPlaybackEnded
  };
};

interface PrePlaybackPlayOverlayWrapperProps {
  isPlaybackEnded: boolean;
  relatedManager: RelatedManager;
}

const PrePlaybackPlayOverlayWrapper = connect(mapStateToProps)((props: PrePlaybackPlayOverlayWrapperProps) => {
  return props.isPlaybackEnded && props.relatedManager.showOnPlaybackDone ? undefined : <PrePlaybackPlayOverlay />;
});

export {PrePlaybackPlayOverlayWrapper};
