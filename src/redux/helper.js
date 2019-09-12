// @ts-check
import { InversedParam } from './types';

export const getParamSetter = (state, action, param, refresh = false) => ({
  ...state,
  meta: {
    prevState: state,
    refresh
  },
  [InversedParam[param]]: action.payload.value,
});