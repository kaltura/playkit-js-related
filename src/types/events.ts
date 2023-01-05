/**
 * Related plugin events which are dispatched externally through the player.
 */
enum RelatedEvent {
  /**
   * Fired when the user toggles list visibility on.
   */
  RELATED_CLICKED = 'relatedClicked',
  /**
   * Fired when the user clicks on a grid or list entry.
   */
  RELATED_SELECTED = 'relatedSelected'
}

/**
 * Related plugin events which are dispatched internally inside the plugin.
 *
 * @enum {string}
 */
enum RelatedInternalEvent {
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

export {RelatedInternalEvent, RelatedEvent};
