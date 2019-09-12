// @ts-check

import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { filter, tap } from 'rxjs/operators';

import { rootReducer } from './redux/reducers';
import { Param } from './redux/types';
import { Subject, Observable } from 'rxjs';
import { initState, publishParam } from './workerActions';

const epicMiddleware = createEpicMiddleware();

const rootSubject = new Subject();

const state$ = rootSubject.pipe(
    tap(({meta, ...state}) => {
        const { synthNode } = initState;
        
        Object.keys(state).map(stateKey => {
            const paramIden = Param[stateKey];
            if (typeof paramIden !== 'undefined') {
                publishParam(synthNode, paramIden, state, meta || { prevState: {} });
            }
        });
    })
);

/**
 * @param {Observable<any>} action$ 
 */
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
    const actionSub = state$.subscribe(({meta, ...state}) => callback(state));
    return () => actionSub.unsubscribe();
}

export const store = configureStore(undefined);

store.subscribe(() => {
    rootSubject.next(store.getState());
});

export default store;

