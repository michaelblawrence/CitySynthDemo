// @ts-check

import * as types from './actionTypes';
import { getParamSetter, getMetaParamSetter } from './helper';
import { Param, MetaParam } from './types';

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
    PitchReducer,
  ];
  return reducers.reduce((state, reducer) => reducer(action, state), state);
}

function MetaReducer(action, state) {
  switch (action.type) {
    case types.SET_ALL_PARAMS:
      return { ...state, ...action.payload };
    case types.ALT_KEY_PRESSED:
      return getMetaParamSetter(state, true, MetaParam.altEnabled);
    case types.ALT_KEY_RELEASED:
      return getMetaParamSetter(state, false, MetaParam.altEnabled);
    case types.EVENT_OCTAVE_INCREMENT:
      return getMetaParamSetter(state, action.payload, MetaParam.kbOctave, true);
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
    case types.SET_ENABLE_FILTER_EG:
      return getParamSetter(state, action, Param.LPFenvelope, true);
    case types.SET_PARAM_FILTER_EG_ATTACK:
      return getParamSetter(state, action, Param.LPFattack, true);
    case types.SET_PARAM_FILTER_EG_RELEASE:
      return getParamSetter(state, action, Param.LPFrelease, true);
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
    case types.SET_PARAM_2ND_HARM_GAIN:
      return getParamSetter(state, action, Param.Harmonic2Gain);
    case types.SET_META_PARAM_ALT_ENABLED:
      return getMetaParamSetter(state, action.payload.value, MetaParam.altEnabled);
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
    case types.SET_PARAM_OSC_PHASE:
      return getParamSetter(state, action, Param.HarmonicPhase);
    case types.SET_PARAM_OSC_WAVEFUNCTION:
      return getParamSetter(state, action, Param.WFunction);
    case types.SET_PARAM_OSC_GAIN:
      return getParamSetter(state, action, Param.Gain);
    case types.SET_PARAM_DELAY_WET:
      return getParamSetter(state, action, Param.DelayWet);
    case types.SET_PARAM_REVERB_LENGTH:
      return getParamSetter(state, action, Param.ReverbWet);
    default:
      return state;
  }
}


function PitchReducer(action, state) {
  switch (action.type) {
    case types.SET_PARAM_PITCH_LFO_RATE:
      return getParamSetter(state, action, Param.Pitchmod);
    case types.SET_PARAM_PITCH_LFO_WIDTH:
      return getParamSetter(state, action, Param.PitchmodWidth);
    default:
      return state;
  }
}
