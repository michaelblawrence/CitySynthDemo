import { InvertedParam, InvertedMetaParam } from '../types';

export const setParamValueFactory = (actionType) => {
  return value => ({
    type: actionType,
    payload: {
      value
    }
  });
};

export const setAllParamsActionFactory = (actionType) => {
  return data => ({
    type: actionType,
    payload: data
  });
};

export const userEventActionFactory = (actionType) => {
  return payload => ({
    type: actionType,
    payload
  });
};

export const createStoreHook = (param, actionCreator, [min, max] = [null, null]) => {
  return [(state) => state[InvertedParam[param]], actionCreator, [min, max]];
};

export const createMetaStoreHook = (param, actionCreator, [min, max] = [null, null]) => {
  return [(state) => state.meta[InvertedMetaParam[param]], actionCreator, [min, max]];
};
