import { configureStore } from 'redux-starter-kit';
import * as types from './redux/actionTypes';

function rootReducer(state, action) {
    if (typeof state === 'undefined') {
        return {};
    }

    switch (action.type) {
        case types.SET_PARAM_AMP_ATTACK:
            return {...state, attack: action.payload.value};
        case types.SET_PARAM_AMP_DECAY:
            return {...state, decay: action.payload.value};
        case types.SET_PARAM_AMP_SUSTAIN:
            return {...state, sustain: action.payload.value};
        case types.SET_PARAM_AMP_RELEASE:
            return {...state, release: action.payload.value};
        default:
            return state;
    }
}

async function getWasmModule() {
    const response = await fetch('wasm-synth/citysynth_wasm_bg.wasm');
    const bytes = await response.arrayBuffer();
    debugger;
    const instance = WebAssembly.instantiate(bytes, imports);
    debugger;
};

export const _ = getWasmModule();

export const store = configureStore({ reducer: rootReducer });

store.subscribe((a) => {console.log(a); console.warn(store.getState());})

export default store;