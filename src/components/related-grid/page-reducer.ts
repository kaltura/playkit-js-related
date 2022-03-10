import {PageAction} from './page-action';

const PageReducer = (state: {prevPage: number; currPage: number; nextPage: number}, action: PageAction) => {
  const {prevPage, currPage, nextPage} = state;
  const offset = action === PageAction.NEXT ? 1 : -1;
  return {
    prevPage: prevPage + offset,
    currPage: currPage + offset,
    nextPage: nextPage + offset
  };
};

export {PageReducer};
