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
export const getMetaParamSetter = (state, value, param, increment = false) => {
  const { meta } = state;
  const _value = increment
    ? value + (state.meta[InvertedMetaParam[param]] || 0)
    : value;
  return {
    ...state,
    meta: {
      ...meta,
      [InvertedMetaParam[param]]: _value,
    }
  };
};