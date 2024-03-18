/**
 * Related plugin event types.
 */
const RelatedEvent = {
  /**
   * Fired when the user clicks the button to show the related list.
   */
  RELATED_OPEN: 'related_open',
  /**
   * Fired when the user clicks the button to close the related list.
   */
  RELATED_CLOSE: 'related_close',
  /**
   * Fired when the user selects an entry from the list or the grid.
   */
  RELATED_ENTRY_SELECTED: 'related_entry_selected',
  /**
   * Fired when the user selects an entry from the list or the grid.
   */
  RELATED_ENTRY_AUTO_PLAYED: 'related_entry_auto_played',
  /**
   * Fired when the related grid is shown or hidden.
   */
  RELATED_GRID_DISPLAYED: 'related_grid_displayed'
};

export {RelatedEvent};
