/** Player sources data, extended with additional fields used for presentation of the entry. */
interface Sources extends KalturaPlayerTypes.Sources {
  /**
   * Internal index of the entry, used for managing entry order.
   *
   * @type {number}
   * @memberof Sources
   */
  internalIndex: number;
  /**
   * Formatted entry duration text.
   *
   * @type {string}
   * @memberof Sources
   */
  durationText: string;
}

export {Sources};
