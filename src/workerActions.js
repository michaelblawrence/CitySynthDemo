// @ts-check

import { InvertedParam, InvertedMetaParam, MetaParam } from './redux/types';
import { setAllParams, keyDownEvent, keyUpEvent } from './redux/actions/MetaActions';
import { validateKeyCode } from './common/DataExtensions';
import { store, keyEvents$, observerSubscribe } from './store';
import * as types from './redux/actionTypes';
// eslint-disable-next-line no-unused-vars
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { filter, take, map, shareReplay } from 'rxjs/operators';
import { ofType } from 'redux-observable';

/**
 * @type {{ 
 *  hasStarted: boolean, 
 *  synthNode: AudioWorkletNode, 
 *  synthNodePort$: Observable<any>, 
 *  synthWaveformSubscription: Subscription
 *  dumpParamsSubscription: Subscription
 * }}
 */
export const initState = {
  hasStarted: false,
  synthNode: null,
  synthNodePort$: null,
  synthWaveformSubscription: null,
  dumpParamsSubscription: null
};
//could await this

const presetPromptKey = { key: '.', keyCode: 190 };

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
  sendKeyDown: (keyEvent) => ({ type: WorkerActions.KEY_DOWN, data: keyEvent }),
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
  if (initState.synthNode) {
    return;
  }
  // @ts-ignore
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const actx = new AudioContext();
  await actx.audioWorklet.addModule('audio.js');
  const module = await getModule();
  const synthNode = new AudioWorkletNode(actx, 'city-rust');
  postWorkerAction(synthNode, WorkerActionFactory.sendModule(module));
  synthNode.connect(actx.destination);
  initState.synthNode = synthNode;
  const port$ = new Observable((subscriber) => {
    synthNode.port.onmessage = (ev) => {
      subscriber.next({ message: ev, error: null });
    };

    synthNode.port.onmessageerror = (ev) => {
      subscriber.next({ error: ev, message: null });
    };

    return () => {
      synthNode.port.onmessage = null;
      synthNode.port.onmessageerror = null;
    };
  }).pipe(shareReplay());
  setupInitState(port$);
  await syncParamsState();
}

const waveformSubject = new Subject();
export const waveform$ = waveformSubject.asObservable();

const dumpParamsSubject = new Subject();

function setupInitState(port$) {
  initState.synthNodePort$ = port$.pipe(
    filter(next => next.error === null),
    map(next => next.message)
  );

  initState.synthWaveformSubscription = port$.pipe(
    filter(next => next.error === null),
    filter(({ message }) => message.data.type === 'WAVEFORM_PUSH'),
    map(({ message }) => message.data.samples),
  ).subscribe(samples => waveformSubject.next(samples));

  initState.dumpParamsSubscription = initState.synthNodePort$.pipe(
    filter(evt => evt.data.type === 'DUMP_PARAMS_CALLBACK'),
    filter(evt => typeof evt.data.dump !== 'undefined')
  ).subscribe(samples => dumpParamsSubject.next(samples));
}

async function getAllParamValues() {
  return await new Promise((resolve, reject) => {
    try {
      const { synthNode } = initState;
      if (synthNode) {
        dumpParamsSubject.pipe(
          take(1)
        ).subscribe(({ data }) => {
          if (typeof data !== 'undefined') {
            resolve(data.dump);
          }
        });
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

export function publishParam(paramIden, state, meta) {
  const param = InvertedParam[paramIden];
  const { synthNode } = initState;
  if (synthNode && typeof state[param] !== 'undefined' && meta.prevState[param] !== state[param]) {
    postWorkerAction(synthNode, WorkerActionFactory.setState({ param, value: state[param] }));
    // TODO: replace with forward/inverse param type pairing
    if (meta[InvertedMetaParam[MetaParam.refresh]]) {
      postWorkerAction(synthNode, WorkerActionFactory.triggerRefresh());
    }
  }
}

export async function postPresetLine(presetLine) {
  const { synthNode } = initState;
  if (synthNode && presetLine) {
    postWorkerAction(synthNode, WorkerActionFactory.setPreset(presetLine));
    postWorkerAction(synthNode, WorkerActionFactory.triggerRefresh());
    await syncParamsState();
  }
}

/**
 * @param {{keyCode: number, oct?: number}} evt
 */
const handleKeyDown = ({ keyCode, oct }) => {
  const { synthNode } = initState;
  if (!validateKeyCode(keyCode)) {
    return;
  }
  postWorkerAction(synthNode, WorkerActionFactory.sendKeyDown({ keyCode, oct: oct || 0 }));
};

/**
 * @param {{keyCode: number}} evt
 */
const handleKeyUp = ({ keyCode }) => {
  const { synthNode } = initState;
  if (keyCode === presetPromptKey.keyCode) {
    const samplePresetLine = '56:T-Organic:318|a:1;d:94;s:0.86;r:2;h:2;hc:0.2190476;hp:0;w:2;hw:0;b:-1;lpf:13441.8;lfo:0;prate:0;pwidth:0;arate:30;awidth:0;lwidth:500;la:5;lr:5;lf:5;lc:5000;delay:120;dwet:0.2057;rwet:0.04;filter:0;lpfenv:0;sub:0.3668478';
    const presetLine = prompt('preset data: ', samplePresetLine);
    postWorkerAction(synthNode, WorkerActionFactory.setPreset(presetLine));
    syncParamsState();
    return;
  }
  if (!validateKeyCode(keyCode)) {
    return;
  }
  postWorkerAction(synthNode, WorkerActionFactory.sendKeyUp(keyCode));
};

const keyDown$ = keyEvents$.pipe(
  ofType(types.EVENT_KEY_DOWN),
  map(action => action.payload)
);

keyDown$.subscribe(keyEvt => {
  const { synthNode } = initState;
  if (synthNode) {
    handleKeyDown(keyEvt);
  }
});

const keyUp$ = keyEvents$.pipe(
  ofType(types.EVENT_KEY_UP),
  map(action => action.payload)
);

keyUp$.subscribe(({ keyCode }) => {
  const { synthNode } = initState;
  if (synthNode) {
    // @ts-ignore
    handleKeyUp({ keyCode });
  }
});

const octaveSubject = new BehaviorSubject(0);
const octaveSelector = store => store.meta[InvertedMetaParam[MetaParam.kbOctave]] || 0;
observerSubscribe(store => {
  octaveSubject.next(octaveSelector(store));
}, octaveSelector);

window.addEventListener('keydown', (evt) => {
  const { synthNode } = initState;
  if (synthNode && !evt.repeat) {
    store.dispatch(keyDownEvent({ keyCode: evt.keyCode, oct: octaveSubject.getValue() }));
  }
});

window.addEventListener('keyup', (evt) => {
  const { synthNode } = initState;
  if (synthNode && !evt.repeat) {
    store.dispatch(keyUpEvent({ keyCode: evt.keyCode }));
  }
});
