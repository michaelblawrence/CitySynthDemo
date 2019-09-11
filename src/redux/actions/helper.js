import { InversedParam } from "../types";

export const setParamValueFactory = (actionType) => {
  return value => ({
    type: actionType,
    payload: {
      value
    }
  });
}

export const setAllParamsActionFactory = (actionType) => {
  return dump => ({
    type: actionType,
    payload: dump
  });
}

export const createStoreHook = (param, actionCreator, [min, max]) => {
  return [(state) => state[InversedParam[param]], actionCreator, [min, max]];
}
