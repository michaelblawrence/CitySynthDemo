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
        FilterEnvReducer,
        FilterTouchReducer,
        OscReducer,
        MasterReducer,
        MetaReducer,
    ];
    return reducers.reduce((state, reducer) => reducer(action, state), state);
}

function MetaReducer(action, state) {
    switch (action.type) {
        case types.SET_ALL_PARAMS:
            return {...state, ...action.payload};
        default:
            return state;
    }
}

function AmpEnvReducer(action, state) {
    switch (action.type) {
        case types.SET_PARAM_AMP_ATTACK:
            return getParamSetter(state, action, Param.Attack, true);
        case types.SET_PARAM_AMP_DECAY:
            return getParamSetter(state, action, Param.Decay, true);
        case types.SET_PARAM_AMP_SUSTAIN:
            return getParamSetter(state, action, Param.Sustain, true);
        case types.SET_PARAM_AMP_RELEASE:
            return getParamSetter(state, action, Param.Release, true);
        case types.SET_PARAM_AMP_LFO_RATE:
            return getParamSetter(state, action, Param.AmpLFOrate);
        case types.SET_PARAM_AMP_LFO_WIDTH:
            return getParamSetter(state, action, Param.AmpLFOwidth);
        default:
            return state;
    }
}

function FilterEnvReducer(action, state) {
    switch (action.type) {
        case types.SET_PARAM_FILTER_EG_ATTACK:
            return getParamSetter(state, action, Param.LPFattack);
        case types.SET_PARAM_FILTER_EG_RELEASE:
            return getParamSetter(state, action, Param.LPFrelease);
        case types.SET_PARAM_FILTER_EG_FLOOR:
            return getParamSetter(state, action, Param.LPFfloor);
        case types.SET_PARAM_FILTER_EG_CEILING:
            return getParamSetter(state, action, Param.LPFceiling);
        default:
            return state;
    }
}

function FilterTouchReducer(action, state) {
    switch (action.type) {
        case types.SET_PARAM_FILTER_CUTOFF:
            return getParamSetter(state, action, Param.LPF);
        default:
            return state;
    }
}

function MasterReducer(action, state) {
    switch (action.type) {
        case types.SET_PARAM_FILTER_LFO_RATE:
            return getParamSetter(state, action, Param.LPFmodrate);
        case types.SET_PARAM_FILTER_LFO_WIDTH:
            return getParamSetter(state, action, Param.LPFwidth);
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
