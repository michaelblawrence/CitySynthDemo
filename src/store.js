// @ts-check

import { configureStore } from 'redux-starter-kit';
import { rootReducer } from './redux/reducers';
import { Param, InversedParam } from './redux/types';

const WorkerActions = {
    MODULE: 'MODULE',
    SET_PRESET: 'SET_PRESET',
    SET_PARAM: 'SET_PARAM',
    KEY_DOWN: 'KEY_DOWN',
    KEY_UP: 'KEY_UP',
}
const WorkerActionFactory = {
    sendModule: (module) => ({ type: WorkerActions.MODULE, data: module }),
    sendKeyDown: (keyCode) => ({ type: WorkerActions.KEY_DOWN, data: keyCode }),
    sendKeyUp: (keyCode) => ({ type: WorkerActions.KEY_UP, data: keyCode }),
    setState: (paramData) => ({ type: WorkerActions.SET_PARAM, data: paramData }),
    setPreset: (presetLine) => ({ type: WorkerActions.SET_PRESET, data: presetLine }),
}

const initState = { hasStarted: false, synthNode: null };

export async function getWasmModule() {
    const actx = new (window.AudioContext || window['webkitAudioContext'])();
    await actx.audioWorklet.addModule('audio.js');

    const module = await getModule();

    const synthNode = new AudioWorkletNode(actx, 'city-rust');
    synthNode.port.postMessage(WorkerActionFactory.sendModule(module))
    synthNode.connect(actx.destination);
    initState.synthNode = synthNode;
}

const presetPromptChar = '.';

window.addEventListener('keydown', (evt) => {
    // evt.preventDefault();
    const { synthNode } = initState;
    if (synthNode && !evt.repeat) {
        if (evt.key === presetPromptChar) {
            return;
        }
        console.warn('keydown ' + evt.keyCode);
        synthNode.port.postMessage(WorkerActionFactory.sendKeyDown(evt.keyCode));
    }
})

window.addEventListener('keyup', (evt) => {
    // evt.preventDefault();
    const { synthNode } = initState;
    if (synthNode && !evt.repeat) {
        if (evt.key === presetPromptChar) {
            const samplePresetLine = '56:T-Organic:318|a:1;d:94;s:0.86;r:2;h:2;hc:0.2190476;hp:0;w:2;hw:0;b:-1;lpf:13441.8;lfo:0;prate:0;pwidth:0;arate:30;awidth:0;lwidth:500;la:5;lr:5;lf:5;lc:5000;delay:120;dwet:0.2057;rwet:0.352;filter:0;lpfenv:0;sub:0.3668478';
            const presetLine = prompt('preset data: ', samplePresetLine);
            synthNode.port.postMessage(WorkerActionFactory.setPreset(presetLine));
            return;
        }
        console.warn('keyup ' + evt.keyCode);
        synthNode.port.postMessage(WorkerActionFactory.sendKeyUp(evt.keyCode));
    }
})

export const store = configureStore({ reducer: rootReducer });

store.subscribe(() => {
    const {meta, ...state} = store.getState();
    const { synthNode } = initState;

    Object.keys(state).map(stateKey => {
        const paramIden = Param[stateKey];
        if (typeof paramIden !== 'undefined') {
            publishParam(synthNode, paramIden, state, meta);
        }
    });

    console.log(state);
});

export default store;

function publishParam(worket, paramIden, state, meta) {
    const param = InversedParam[paramIden];
    if (worket && typeof state[param] !== 'undefined' && meta.prevState[param] !== state[param]) {
        console.warn('current ' + state[param]);
        worket.port.postMessage(WorkerActionFactory.setState({ param, value: state[param] }));
    }
}

async function getModule() {
    const response = await fetch('wasm-synth/citysynth_wasm_bg.wasm');
    const bytes = await response.arrayBuffer();
    return await WebAssembly.compile(bytes);
}
