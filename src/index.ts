import {pluginName, Related} from './related';
import {registerPlugin} from '@playkit-js/kaltura-player-js';

declare let __VERSION__: string;
declare let __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {Related as Plugin};
export {VERSION, NAME};

registerPlugin(pluginName, Related as any);
