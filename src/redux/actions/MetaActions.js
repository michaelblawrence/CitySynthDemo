import * as types from '../actionTypes';
import { setAllParamsActionFactory, userEventActionFactory } from './helper';

export const setAllParams = setAllParamsActionFactory(types.SET_ALL_PARAMS);

export const keyDownEvent = userEventActionFactory(types.EVENT_KEY_DOWN);
export const keyUpEvent   = userEventActionFactory(types.EVENT_KEY_UP);
