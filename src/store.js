// @ts-check

import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware, combineEpics, ofType } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';

import { rootReducer } from './redux/reducers';
import { Param, InvertedMetaParam, MetaParam } from './redux/types';
import { publishParam } from './workerActions';
import { EVENT_KEY_UP, EVENT_KEY_DOWN, ALT_KEY_PRESSED, ALT_KEY_RELEASED, EVENT_OCTAVE_INCREMENT } from './redux/actionTypes';
import { altKeyPressed, octaveKeyPressed } from './common/DataExtensions';

const epicMiddleware = createEpicMiddleware();

/**
 * @param {{type: string, payload: any}} ev
 */
const handleTouchEnable = ev => {
  const octaveKey = octaveKeyPressed(ev.payload && ev.payload.keyCode);
  if (octaveKey && ev.type === EVENT_KEY_DOWN) {
    store.dispatch({
      type: EVENT_OCTAVE_INCREMENT,
      payload: octaveKey
    });
  }
  if (altKeyPressed(ev.payload && ev.payload.keyCode)) {
    store.dispatch({
      type: ev.type === EVENT_KEY_DOWN ? ALT_KEY_PRESSED : ALT_KEY_RELEASED,
      payload: {}
    });
  }
};

/** @type Subject<{type: string, payload: {keyCode: number, oct?: number}}> */
const keyEventsSubject = new Subject();
export const keyEvents$ = keyEventsSubject.asObservable();

const octaveSubject = new BehaviorSubject(0);

/**
 * @param {Observable<{type: string, payload: any}>} action$ 
 */
const rootEpic = action$ => {
  const keyDown$ = action$.pipe(
    filter(action => action.type === EVENT_KEY_UP || action.type === EVENT_KEY_DOWN),
  );
  keyDown$.subscribe(handleTouchEnable);
  keyDown$.subscribe(keyEventsSubject);

  const octaveChanged$ = action$.pipe(
    ofType(EVENT_OCTAVE_INCREMENT),
    map(action => action.payload)
  );
  octaveChanged$.subscribe(octaveSubject);

  return new Observable(() => {});
};

export function configureStore(preloadedState) {
  const epics = [
    rootEpic,
  ];
  const composedEpics = combineEpics(...epics);

  const middlewares = [
    epicMiddleware,
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [
    middlewareEnhancer
  ];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  epicMiddleware.run(composedEpics);

  return store;
}

const initialState = {
  meta: {
    prevState: {},
    [InvertedMetaParam[MetaParam.kbOctave]] : -1
  }
};

export const store = configureStore(initialState);

export const store$ = new Observable(subscriber => store.subscribe(() => subscriber.next(store.getState())));

store$.subscribe(({ meta, ...state }) => {
  const prevParams = Object.keys(Param).map(paramKey => `${paramKey},${meta.prevState[paramKey]}`);
  const prevSet = new Set(prevParams);

  const params = Object.keys(Param).map(paramKey => `${paramKey},${state[paramKey]}`);
  const changedParams = params.filter(param => !prevSet.has(param));

  changedParams.forEach(stateKeyJoined => {
    const stateKey = stateKeyJoined.split(',')[0];
    const paramIden = Param[stateKey];
    if (typeof paramIden !== 'undefined') {
      publishParam(paramIden, state, meta || { prevState: {} });
    }
  });
});

const replayStore$ = store$.pipe(shareReplay());

export function observerSubscribe(callback, selector = null) {
  const mappedStore$ = selector
    ? replayStore$.pipe(distinctUntilChanged((x, y) => selector(x) === selector(y)))
    : replayStore$;

  // eslint-disable-next-line no-unused-vars
  const actionSub = mappedStore$.subscribe(state => callback(state));
  return () => actionSub.unsubscribe();
}

export { waveform$ } from './workerActions';

export default store;

