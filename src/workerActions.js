// @ts-check

import { InversedParam } from './redux/types';
import { setAllParams } from './redux/actions/MetaActions';
import { validateKeyCode } from './common/DataExtensions/MidiDataExtensions';
import { store } from './store';

/**
 * @type {{hasStarted: boolean, synthNode: AudioWorkletNode}}
 */
export const initState = { hasStarted: false, synthNode: null };
const presetPromptChar = '.';
const getParamChar = ',';

const WorkerActions = {
    MODULE: 'MODULE',
    DUMP_PARAMS: 'DUMP_PARAMS',
    REFRESH_EG: 'REFRESH_EG',
    SET_PRESET: 'SET_PRESET',
    GET_PARAM: 'GET_PARAM',
    SET_PARAM: 'SET_PARAM',
    KEY_DOWN: 'KEY_DOWN',
    KEY_UP: 'KEY_UP',
};

const WorkerActionFactory = {
    sendModule: (module) => ({ type: WorkerActions.MODULE, data: module }),
    sendKeyDown: (keyCode) => ({ type: WorkerActions.KEY_DOWN, data: keyCode }),
    sendKeyUp: (keyCode) => ({ type: WorkerActions.KEY_UP, data: keyCode }),
    getState: (paramIden) => ({ type: WorkerActions.GET_PARAM, data: paramIden }),
    setState: (paramData) => ({ type: WorkerActions.SET_PARAM, data: paramData }),
    dumpState: () => ({ type: WorkerActions.DUMP_PARAMS, data: { dumpAll: true } }),
    setPreset: (presetLine) => ({ type: WorkerActions.SET_PRESET, data: presetLine }),
    triggerRefresh: () => ({ type: WorkerActions.REFRESH_EG, data: {} }),
};

/**
 * @param {AudioWorkletNode} workletNode
 * @param {{ type: string; data: any; }} workerAction
 */
function postWorkerAction(workletNode, workerAction) {
    workletNode.port.postMessage(workerAction);
}
async function getModule() {
    const response = await fetch('wasm-synth/citysynth_wasm_bg.wasm');
    const bytes = await response.arrayBuffer();
    return await WebAssembly.compile(bytes);
}
export async function getWasmModule() {
    const actx = new (window.AudioContext || window['webkitAudioContext'])();
    await actx.audioWorklet.addModule('audio.js');
    const module = await getModule();
    const synthNode = new AudioWorkletNode(actx, 'city-rust');
    postWorkerAction(synthNode, WorkerActionFactory.sendModule(module));
    synthNode.connect(actx.destination);
    initState.synthNode = synthNode;
    syncParamsState();
}
async function getParamValue(paramIden) {
    return await new Promise((resolve, reject) => {
        try {
            /**
             * @type {{synthNode: AudioWorkletNode}}
             */
            const { synthNode } = initState;
            if (synthNode && typeof paramIden !== 'undefined') {
                /**
                 * @param {MessageEvent} evt
                 */
                synthNode.port.onmessage = evt => {
                    const { data } = evt;
                    if (typeof data !== 'undefined' && data.type === 'PARAM_CALLBACK' && data.paramIden === paramIden) {
                        synthNode.port.onmessage = null;
                        resolve(data.value);
                    }
                };
                postWorkerAction(synthNode, WorkerActionFactory.getState({ param: InversedParam[paramIden] }));
            }
        }
        catch (ex) {
            reject(ex);
        }
    });
}
async function getAllParamValues() {
    return await new Promise((resolve, reject) => {
        try {
            /**
             * @type {{synthNode: AudioWorkletNode}}
             */
            const { synthNode } = initState;
            if (synthNode) {
                /**
                 * @param {MessageEvent} evt
                 */
                synthNode.port.onmessage = evt => {
                    const { data } = evt;
                    if (typeof data !== 'undefined' && data.type === 'DUMP_PARAMS_CALLBACK' && typeof data.dump !== 'undefined') {
                        synthNode.port.onmessage = null;
                        resolve(data.dump);
                    }
                };
                postWorkerAction(synthNode, WorkerActionFactory.dumpState());
            }
        }
        catch (ex) {
            reject(ex);
        }
    });
}
async function syncParamsState() {
    const dump = await getAllParamValues();
    store.dispatch(setAllParams(dump));
}
export function publishParam(worket, paramIden, state, meta) {
    const param = InversedParam[paramIden];
    if (worket && typeof state[param] !== 'undefined' && meta.prevState[param] !== state[param]) {
        worket.port.postMessage(WorkerActionFactory.setState({ param, value: state[param] }));
        if (meta.refresh) {
            worket.port.postMessage(WorkerActionFactory.triggerRefresh());
        }
    }
}
window.addEventListener('keydown', (evt) => {
    const { synthNode } = initState;
    if (synthNode && !evt.repeat) {
        if (!validateKeyCode(evt.keyCode)) {
            return;
        }
        console.warn('keydown ' + evt.keyCode);
        postWorkerAction(synthNode, WorkerActionFactory.sendKeyDown(evt.keyCode));
    }
});
window.addEventListener('keyup', (evt) => {
    const { synthNode } = initState;
    if (synthNode && !evt.repeat) {
        if (evt.key === presetPromptChar) {
            const samplePresetLine = '56:T-Organic:318|a:1;d:94;s:0.86;r:2;h:2;hc:0.2190476;hp:0;w:2;hw:0;b:-1;lpf:13441.8;lfo:0;prate:0;pwidth:0;arate:30;awidth:0;lwidth:500;la:5;lr:5;lf:5;lc:5000;delay:120;dwet:0.2057;rwet:0.352;filter:0;lpfenv:0;sub:0.3668478';
            const presetLine = prompt('preset data: ', samplePresetLine);
            postWorkerAction(synthNode, WorkerActionFactory.setPreset(presetLine));
            syncParamsState();
            return;
        }
        if (evt.key === getParamChar) {
            getParamValue(0).then(console.log);
            return;
        }
        if (!validateKeyCode(evt.keyCode)) {
            return;
        }
        console.warn('keyup ' + evt.keyCode);
        postWorkerAction(synthNode, WorkerActionFactory.sendKeyUp(evt.keyCode));
    }
});
