import * as types from '../actionTypes';
import { setParamValueFactory } from './helper';

export const setParamAttack  = setParamValueFactory(types.SET_PARAM_AMP_ATTACK);
export const setParamDecay   = setParamValueFactory(types.SET_PARAM_AMP_DECAY);
export const setParamSustain = setParamValueFactory(types.SET_PARAM_AMP_SUSTAIN);
export const setParamRelease = setParamValueFactory(types.SET_PARAM_AMP_RELEASE);
export const setParamRate    = setParamValueFactory(types.SET_PARAM_AMP_LFO_RATE);
export const setParamWidth   = setParamValueFactory(types.SET_PARAM_AMP_LFO_WIDTH);
