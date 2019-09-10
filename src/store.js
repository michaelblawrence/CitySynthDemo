// @ts-check

import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { filter, mapTo, tap } from 'rxjs/operators';

import { rootReducer } from './redux/reducers';
import { Param, InversedParam } from './redux/types';
import { setAllParams } from './redux/actions/MetaActions';
import { validateKeyCode } from './common/DataExtensions/MidiDataExtensions';
import { Subject, Observable } from 'rxjs';

const WorkerActions = {
    MODULE: 'MODULE',
    DUMP_PARAMS: 'DUMP_PARAMS',
    REFRESH_EG: 'REFRESH_EG',
    SET_PRESET: 'SET_PRESET',
    GET_PARAM: 'GET_PARAM',
    SET_PARAM: 'SET_PARAM',
    KEY_DOWN: 'KEY_DOWN',
    KEY_UP: 'KEY_UP',
}
const WorkerActionFactory = {
    sendModule: (module) => ({ type: WorkerActions.MODULE, data: module }),
    sendKeyDown: (keyCode) => ({ type: WorkerActions.KEY_DOWN, data: keyCode }),
    sendKeyUp: (keyCode) => ({ type: WorkerActions.KEY_UP, data: keyCode }),
    getState: (paramIden) => ({ type: WorkerActions.GET_PARAM, data: paramIden }),
    setState: (paramData) => ({ type: WorkerActions.SET_PARAM, data: paramData }),
    dumpState: () => ({ type: WorkerActions.DUMP_PARAMS, data: { dumpAll: true } }),
    setPreset: (presetLine) => ({ type: WorkerActions.SET_PRESET, data: presetLine }),
    triggerRefresh: () => ({ type: WorkerActions.REFRESH_EG, data: {} }),
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

    getAllParamValues().then(dump => {
        store.dispatch(setAllParams(dump));
    });
}

const presetPromptChar = '.';
const getParamChar = ',';

window.addEventListener('keydown', (evt) => {
    // evt.preventDefault();
    const { synthNode } = initState;
    if (synthNode && !evt.repeat) {
        if (!validateKeyCode(evt.keyCode)) {
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
        if (evt.key === getParamChar) {
            getParamValue(0).then(console.log);
            return;
        }
        if (!validateKeyCode(evt.keyCode)) {
            return;
        }
        console.warn('keyup ' + evt.keyCode);
        synthNode.port.postMessage(WorkerActionFactory.sendKeyUp(evt.keyCode));
    }
})

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
                }
                synthNode.port.postMessage(WorkerActionFactory.getState({ param: InversedParam[paramIden] }));
            }
        } catch (ex) {
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
                }
                synthNode.port.postMessage(WorkerActionFactory.dumpState());
            }
        } catch (ex) {
            reject(ex);
        }
    });
}

const epicMiddleware = createEpicMiddleware();

const rootSubject = new Subject();

/**
 * 
 * @param {Observable<any>} action$ 
 */
const rootEpic = action$ => action$.pipe(
    tap(rootSubject),
    tap(nextState => {
        console.log(nextState);
    }),
    filter(() => false)
);

export const store = configureStore(undefined);

export function configureStore(preloadedState) {
    const middlewares = [
        // thunkMiddleware,
        epicMiddleware,
    ];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const enhancers = [middlewareEnhancer];
    const composedEnhancers = composeWithDevTools(...enhancers);

    const store = createStore(rootReducer, preloadedState, composedEnhancers);

    epicMiddleware.run(rootEpic);

    return store;
}

const subscriptions = new Map();

export function observerSubscribe(callback) {
    const obj = {};
    subscriptions.set(obj, callback);
    return () => subscriptions.delete(obj);
}

store.subscribe(() => {
    const { meta, ...state } = store.getState();
    const { synthNode } = initState;

    Object.keys(state).map(stateKey => {
        const paramIden = Param[stateKey];
        if (typeof paramIden !== 'undefined') {
            publishParam(synthNode, paramIden, state, meta || { prevState: {} });
        }
    });
    subscriptions.forEach(callback => callback(state));
    // console.log(state);
});

export default store;

function publishParam(worket, paramIden, state, meta) {
    const param = InversedParam[paramIden];
    if (worket && typeof state[param] !== 'undefined' && meta.prevState[param] !== state[param]) {
        // console.warn('current ' + state[param]);
        worket.port.postMessage(WorkerActionFactory.setState({ param, value: state[param] }));
        if (meta.refresh) {
            worket.port.postMessage(WorkerActionFactory.triggerRefresh());
        }
    }
}

async function getModule() {
    const response = await fetch('wasm-synth/citysynth_wasm_bg.wasm');
    const bytes = await response.arrayBuffer();
    return await WebAssembly.compile(bytes);
}
