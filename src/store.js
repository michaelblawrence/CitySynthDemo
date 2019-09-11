// @ts-check

import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { filter, mapTo, tap } from 'rxjs/operators';

import { rootReducer } from './redux/reducers';
import { Param } from './redux/types';
import { Subject, Observable } from 'rxjs';
import { initState, publishParam } from './workerActions';

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

