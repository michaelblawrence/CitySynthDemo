// @ts-check

import * as types from './actionTypes';
import { getParamSetter } from './helper';
import { Param } from './types';

export function rootReducer(state, action) {
    if (typeof state === 'undefined') {
        return {};
    }
    const reducers = [
        AmpEnvReducer,
        OscReducer,
        MetaReducer,
    ];
    return reducers.reduce((state, reducer) => reducer(action, state), state);
}

function MetaReducer(action, state) {
    switch (action.type) {
        case types.SET_ALL_PARAMS:
            return {...state, ...action.payload};
    }
}

function AmpEnvReducer(action, state) {
    switch (action.type) {
        case types.SET_PARAM_AMP_ATTACK:
            return getParamSetter(state, action, Param.Attack);
        case types.SET_PARAM_AMP_DECAY:
            return getParamSetter(state, action, Param.Decay);
        case types.SET_PARAM_AMP_SUSTAIN:
            return getParamSetter(state, action, Param.Sustain);
        case types.SET_PARAM_AMP_RELEASE:
            return getParamSetter(state, action, Param.Release);
        case types.SET_PARAM_LFO_RATE:
            return getParamSetter(state, action, Param.AmpLFOrate);
        case types.SET_PARAM_LFO_WIDTH:
            return getParamSetter(state, action, Param.AmpLFOwidth);
        default:
            return state;
    }
}

function OscReducer(action, state) {
    switch (action.type) {
        case types.SET_PARAM_DELAY_LENGTH:
            console.warn('unimplemented!');
            return state;
        case types.SET_PARAM_DELAY_WET:
            return getParamSetter(state, action, Param.DelayWet);
        default:
            return state;
    }
}
