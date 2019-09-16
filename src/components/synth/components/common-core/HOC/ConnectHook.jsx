import { useEffect, useState } from 'react';
import store, { observerSubscribe } from '../../../../../store';

export const ConnectHook = (hook, initalValue = 0.5) => (componentCreator) => {

  const [state, setState] = useState(initalValue);

  useEffect(() => {
    const unsubscribe = observerSubscribe((storage) => {
      const { param } = mapStateToProps(storage);
      setState(param);
    });
    return unsubscribe;
  });

  function mapStateToProps(state) {
    return { param: state && hook[0](state) };
  }
  function mapDispatchToProps(value) {
    return store.dispatch(hook[1](value));
  }
  return componentCreator({
    valueChanged: mapDispatchToProps,
    value: state
  });
};