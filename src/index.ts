import {pluginName, Related} from './related';

declare let __VERSION__: string;
declare let __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {Related as Plugin};
export {VERSION, NAME};

KalturaPlayer.core.registerPlugin(pluginName, Related);
