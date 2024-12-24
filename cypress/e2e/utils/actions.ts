import {getNextButtonElement, getListToggleButtonElement, getCloseButtonElement, getRelatedEntryElement} from './getters';

export const clickOnNextButton = () => {
  getNextButtonElement().click({force: true});
};

export const clickOnListToggle = () => {
  getListToggleButtonElement().click({force: true});
};

export const clickOnCloseButton = () => {
  getCloseButtonElement().click({force: true});
};

export const clickOnRelatedEntry = (index: number) => {
  getRelatedEntryElement(index).click({force: true});
};
