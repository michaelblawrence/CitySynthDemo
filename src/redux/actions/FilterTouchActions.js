import * as types from '../actionTypes';
import { setParamValueFactory } from './helper';

export const setParamFilterCutoff   = setParamValueFactory(types.SET_PARAM_FILTER_CUTOFF);
export const setParamHarmonic2Gain  = setParamValueFactory(types.SET_PARAM_2ND_HARM_GAIN);
export const setMetaParamAltEnabled = setParamValueFactory(types.SET_META_PARAM_ALT_ENABLED);

