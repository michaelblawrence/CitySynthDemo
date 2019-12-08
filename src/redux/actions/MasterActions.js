import * as types from '../actionTypes';
import { setParamValueFactory } from './helper';

export const setParamFilterModRate  = setParamValueFactory(types.SET_PARAM_FILTER_LFO_RATE);
export const setParamFilterModeWidth = setParamValueFactory(types.SET_PARAM_FILTER_LFO_WIDTH);

export const setParamMasterLevel = setParamValueFactory(types.SET_PARAM_MASTER_LEVEL);
