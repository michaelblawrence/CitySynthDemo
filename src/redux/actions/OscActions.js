import * as types from '../actionTypes';
import { setParamValueFactory } from "./helper";

export const setParamDelayLength = setParamValueFactory(types.SET_PARAM_DELAY_LENGTH);
export const setParamDelayWetAmt = setParamValueFactory(types.SET_PARAM_DELAY_WET);