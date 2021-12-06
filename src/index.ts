import {Related} from './related';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {Related as Plugin};
export {VERSION, NAME};

const pluginName: string = 'related';

KalturaPlayer.core.registerPlugin(pluginName, Related);
