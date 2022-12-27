/**
 * Internal related plugin events enum.
 *
 * @enum {string}
 */
enum RelatedEvent {
  /**
   * Fired every time the list of related entries is changed.
   */
  RELATED_ENTRIES_CHANGED = 'relatedentrieschanged',
  /**
   * Fired when the a next entry autoplay is manually cancelled by the user on playback end.
   */
  HIDDEN_STATE_CHANGED = 'hiddenstatechanged',
  /**
   * Fired when the related grid is shown or hidden.
   */
  GRID_VISIBILITY_CHANGED = 'gridvisibilitychanged',
  /**
   * Fired when the related list is shown or hidden.
   */
  LIST_VISIBILITY_CHANGED = 'listvisibilitychanged'
}

export {RelatedEvent};
