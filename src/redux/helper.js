// @ts-check
import { InversedParam } from './types';

export const getParamSetter = (state, action, param, refresh = false) => {
  // eslint-disable-next-line no-unused-vars
  const { meta, ...params } = state;
  return {
    ...state,
    meta: {
      prevState: params,
      refresh
    },
    [InversedParam[param]]: action.payload.value,
  };
};