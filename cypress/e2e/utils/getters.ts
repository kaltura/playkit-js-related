export const getRelatedGridElement = () => cy.get('[data-testid="related-grid"]');
export const getRelatedListElement = () => cy.get('[data-testid="related-list"]');
export const getRelatedEntryElement = (index: number) => cy.get(`[data-testid="related-entry-${index}"]`);
export const getNextButtonElement = () => cy.get('[data-testid="related-next-button"]');
export const getListToggleButtonElement = () => cy.get('.listToggleButton');
export const getCountdownElement = () => cy.get('[data-testid="related-countdown"]');
export const getCloseButtonElement = () => cy.get('[data-testid="related-close-button"]');
