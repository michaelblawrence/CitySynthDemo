// @ts-check

import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { Observable } from 'rxjs';
import { filter, tap, shareReplay } from 'rxjs/operators';

import { rootReducer } from './redux/reducers';
import { Param } from './redux/types';
import { initState, publishParam } from './workerActions';
import { EVENT_KEY_UP, EVENT_KEY_DOWN } from './redux/actionTypes';
import { altKeyPressed } from './common/DataExtensions/MidiDataExtensions';

const epicMiddleware = createEpicMiddleware();

/**
 * @param {{type: string, payload: any}} ev
 */
const handleTouchEnable = ev => {
  if (altKeyPressed(ev.payload.keyCode)) {
    // store.dispatch();
  }
};

/**
 * @param {Observable<{type: string, payload: any}>} action$ 
 */
const rootEpic = action$ => action$.pipe(
  filter(action => action.type === EVENT_KEY_UP || action.type === EVENT_KEY_DOWN),
  tap(handleTouchEnable),
  filter(() => false)
);

export function configureStore(preloadedState) {
  const epics = [
    rootEpic
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

export const store = configureStore(undefined);

const store$ = new Observable(subscriber => store.subscribe(() => subscriber.next(store.getState())));

store$.subscribe(({ meta, ...state }) => {
  const { synthNode } = initState;

  Object.keys(state).forEach(stateKey => {
    const paramIden = Param[stateKey];
    if (typeof paramIden !== 'undefined') {
      publishParam(synthNode, paramIden, state, meta || { prevState: {} });
    }
  });
});

const replayStore$ = store$.pipe(shareReplay());

export function observerSubscribe(callback) {
  // eslint-disable-next-line no-unused-vars
  const actionSub = replayStore$.subscribe(state => callback(state));
  return () => actionSub.unsubscribe();
}

export { waveform$ } from './workerActions';

export default store;

