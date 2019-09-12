// @ts-check

import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { rootReducer } from './redux/reducers';
import { Param } from './redux/types';
import { initState, publishParam } from './workerActions';

const epicMiddleware = createEpicMiddleware();

const rootSubject = new Subject();

const state$ = rootSubject.pipe(
  // @ts-ignore
  tap(({ meta, ...state }) => {
    const { synthNode } = initState;

    Object.keys(state).forEach(stateKey => {
      const paramIden = Param[stateKey];
      if (typeof paramIden !== 'undefined') {
        publishParam(synthNode, paramIden, state, meta || { prevState: {} });
      }
    });
  })
);

const rootEpic = action$ => action$.pipe(
  filter(() => false)
);

export function configureStore(preloadedState) {
  const middlewares = [
    epicMiddleware,
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  epicMiddleware.run(rootEpic);

  return store;
}

export function observerSubscribe(callback) {
  // eslint-disable-next-line no-unused-vars
  const actionSub = state$.subscribe(({ meta, ...state }) => callback(state));
  return () => actionSub.unsubscribe();
}

export const store = configureStore(undefined);

store.subscribe(() => {
  rootSubject.next(store.getState());
});

export default store;

