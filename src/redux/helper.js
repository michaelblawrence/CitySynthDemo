// @ts-check
import { InvertedParam, InvertedMetaParam } from './types';

export const getParamSetter = (state, action, param, refresh = false) => {
  const { meta, ...params } = state;
  return {
    ...state,
    meta: {
      ...meta,
      prevState: params,
      refresh
    },
    [InvertedParam[param]]: action.payload.value,
  };
};
export const getMetaParamSetter = (state, action, param, refresh = false) => {
  const { meta } = state;
  return {
    ...state,
    meta: {
      ...meta,
      refresh,
      [InvertedMetaParam[param]]: action.payload.value,
    }
  };
};