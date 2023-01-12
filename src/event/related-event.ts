/**
 * Internal related plugin events enum.
 *
 * @enum {string}
 */
enum RelatedEvent {
  /**
   * Fired every time the list of related entries is changed.
   */
  RELATED_ENTRIES_CHANGED = 'related_entries_changed',
  /**
   * Fired when auto continue state cancellation state is changed.
   */
  AUTO_CONTINUE_CANCELLED_CHANGED = 'auto_continue_cancelled_changed',
  /**
   * Fired when the related grid is shown or hidden.
   */
  GRID_VISIBILITY_CHANGED = 'grid_visibility_changed',
  /**
   * Fired when the related list is shown or hidden.
   */
  LIST_VISIBILITY_CHANGED = 'list_visibility_changed'
}

export {RelatedEvent};
