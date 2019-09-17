import { InversedParam } from '../types';

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

export const createStoreHook = (param, actionCreator, [min, max]) => {
  return [(state) => state[InversedParam[param]], actionCreator, [min, max]];
};
