import * as types from '../actionTypes';
import { setParamValueFactory } from './helper';

export const setParamPitchRate  = setParamValueFactory(types.SET_PARAM_PITCH_LFO_RATE);
export const setParamPitchWidth = setParamValueFactory(types.SET_PARAM_PITCH_LFO_WIDTH);
