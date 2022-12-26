/**
 * Related Events enum
 */
enum RelatedEvent {
  /**
   * RELATED_ENTRIES_CHANGED - fired every time the list of related entries is changed
   */
  RELATED_ENTRIES_CHANGED = 'relatedentrieschanged',
  /**
   * HIDDEN_STATE_CHANGED - fired when the a next entry autoplay is manually cancelled by the user on playback end
   */
  HIDDEN_STATE_CHANGED = 'hiddenstatechanged',
  /**
   * GRID_VISIBILITY_CHANGED - fired when the related grid is shown or hidden
   */
  GRID_VISIBILITY_CHANGED = 'gridvisibilitychanged',
  /**
   * LIST_VISIBILITY_CHANGED - fired when the related list is shown or hidden
   */
  LIST_VISIBILITY_CHANGED = 'listvisibilitychanged'
}

export {RelatedEvent};
