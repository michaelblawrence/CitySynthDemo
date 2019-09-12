import * as types from '../actionTypes';
import { setParamValueFactory } from './helper';

export const setParamOscPhase = setParamValueFactory(types.SET_PARAM_OSC_PHASE);
export const setParamOscWaveFunction = setParamValueFactory(types.SET_PARAM_OSC_WAVEFUNCTION);
export const setParamOscGain = setParamValueFactory(types.SET_PARAM_OSC_GAIN);

export const setParamDelayLength = setParamValueFactory(types.SET_PARAM_DELAY_LENGTH);
export const setParamDelayWetAmt = setParamValueFactory(types.SET_PARAM_DELAY_WET);