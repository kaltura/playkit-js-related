import {createContext} from 'preact';
import {RelatedManager} from 'related-manager';
import {ImageService} from 'services/image-service';

interface ContextData {
  relatedManager?: RelatedManager;
  imageService?: ImageService;
}

const contextData: ContextData = {};
const RelatedContext = createContext(contextData);

export {RelatedContext};
