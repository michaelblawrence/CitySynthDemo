import * as types from '../actionTypes';
import { setParamValueFactory } from './helper';

export const setEnableFilterEG     = setParamValueFactory(types.SET_ENABLE_FILTER_EG);
export const setParamFilterAttack  = setParamValueFactory(types.SET_PARAM_FILTER_EG_ATTACK);
export const setParamFilterRelease = setParamValueFactory(types.SET_PARAM_FILTER_EG_RELEASE);
export const setParamFilterFloor   = setParamValueFactory(types.SET_PARAM_FILTER_EG_FLOOR);
export const setParamFilterCeiling = setParamValueFactory(types.SET_PARAM_FILTER_EG_CEILING);
