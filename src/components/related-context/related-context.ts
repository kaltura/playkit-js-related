import {createContext} from 'preact';
import {RelatedManager} from 'related-manager';

interface ContextData {
  relatedManager?: RelatedManager;
}

const contextData: ContextData = {};
const RelatedContext = createContext(contextData);

export {RelatedContext};
