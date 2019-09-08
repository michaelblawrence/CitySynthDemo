// @ts-check

import { configureStore } from 'redux-starter-kit';
import { rootReducer } from './redux/reducers';
import { Param, InversedParam } from './redux/types';

const WorkerActions = {
    MODULE: 'MODULE',
    SET_PARAM: 'SET_PARAM',
    KEY_DOWN: 'KEY_DOWN',
    KEY_UP: 'KEY_UP',
}
const WorkerActionFactory = {
    sendModule: (module) => ({ type: WorkerActions.MODULE, data: module }),
    sendKeyDown: (keyCode) => ({ type: WorkerActions.KEY_DOWN, data: keyCode }),
    sendKeyUp: (keyCode) => ({ type: WorkerActions.KEY_UP, data: keyCode }),
    setState: (paramData) => ({ type: WorkerActions.SET_PARAM, data: paramData }),
}

// const worker = new Worker('audio.js');
const initState = { hasStarted: false, synthNode: null };

export async function getWasmModule() {
    // await innerGetWasmModule();

    const actx = new (window.AudioContext || window['webkitAudioContext'])();
    await actx.audioWorklet.addModule('audio.js');

    const module = await getModule();

    const synthNode = new AudioWorkletNode(actx, 'city-rust');
    synthNode.port.postMessage(WorkerActionFactory.sendModule(module))
    synthNode.connect(actx.destination);
    initState.synthNode = synthNode;
}

window.addEventListener('keydown', (evt) => {
    // evt.preventDefault();
    const { synthNode } = initState;
    if (synthNode && !evt.repeat) {
        console.warn('keydown ' + evt.keyCode);
        synthNode.port.postMessage(WorkerActionFactory.sendKeyDown(evt.keyCode));
    }
})

window.addEventListener('keyup', (evt) => {
    // evt.preventDefault();
    const { synthNode } = initState;
    if (synthNode && !evt.repeat) {
        console.warn('keyup ' + evt.keyCode);
        synthNode.port.postMessage(WorkerActionFactory.sendKeyUp(evt.keyCode));
    }
})

// async function innerGetWasmModule() {
//     if (initState.hasStarted && worker) {
//         worker.postMessage(WorkerActionFactory.stopTimeout());
//         return;
//     }
//     try {
//         // const citysynthModule = await import('citysynth-wasm');

//         initState.hasStarted = true;

//         const response = await fetch('wasm-synth/citysynth_wasm.wasm');
//         const bytes = await response.arrayBuffer();
//         const module = await WebAssembly.compile(bytes);
//         worker.postMessage(WorkerActionFactory.sendModule(module));
//     } catch (ex) {
//         console.error(ex);
//         initState.hasStarted = false;
//     }
// }

// export const _ = getWasmModule();

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
