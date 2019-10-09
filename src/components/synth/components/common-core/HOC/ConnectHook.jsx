import { useEffect, useState } from 'react';
import store, { observerSubscribe } from '../../../../../store';

export const ConnectHook = (hook, initalValue = 0.5, scale = false) => (componentCreator) => {

  const [state, setState] = useState(initalValue);

  useEffect(() => {
    const unsubscribe = observerSubscribe((storage) => {
      const { param } = mapStateToProps(storage);
      setState(param);
    }, hook[0]);
    return unsubscribe;
  }, [initalValue]);

  function mapStateToProps(state) {
    return { param: state && hook[0](state) };
  }
  function mapDispatchToProps(value) {
    return store.dispatch(hook[1](value));
  }
  if (scale) {
    const [min, max] = (hook && hook[2]) || [0, 1];

    const scaleFromUnit = value => (max - min) * value + min;
    const scaleToUnit = value => (value - min) / (max - min);

    const _value = (hook && (state || state !== 0) && scaleToUnit(state)) || 0;
    const _valueChanged = value => mapDispatchToProps(scaleFromUnit(value));
    return componentCreator({
      valueChanged: _valueChanged,
      value: _value
    });
  }
  return componentCreator({
    valueChanged: mapDispatchToProps,
    value: state
  });
};
