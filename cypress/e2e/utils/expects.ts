import {getRelatedGridElement, getRelatedListElement, getNextButtonElement} from './getters';
import {loadPlayerAndSetMedia} from './setup';

export const setupAndExpect = (pluginConfig: any, setupFunc: (pluginConfig: any) => Promise<any>, expectFunc: (setupResult: any) => void) => {
  setupFunc(pluginConfig).then(result => {
    expectFunc(result);
  });
};

export const expectElementExists = (getElement: () => any) => {
  getElement().should('exist');
};

export const expectElementDoesntExist = (getElement: () => any) => {
  getElement().should('not.exist');
};

export const expectElementContains = (getElement: () => any, texts: string[]) => {
  for (const text of texts) {
    getElement().contains(text).should('exist');
  }
};

export const expectRelatedGridVisible = (pluginConfig: any) => {
  setupAndExpect(pluginConfig, loadPlayerAndSetMedia, () => {
    expectElementExists(getRelatedGridElement);
  });
};

export const expectRelatedListVisible = (pluginConfig: any) => {
  setupAndExpect(pluginConfig, loadPlayerAndSetMedia, () => {
    expectElementExists(getRelatedListElement);
  });
};