/** base player sources data, with additional index and formatted duration text */
interface Sources extends KalturaPlayerTypes.Sources {
  internalIndex: number;
  durationText: string;
}

export {Sources};
