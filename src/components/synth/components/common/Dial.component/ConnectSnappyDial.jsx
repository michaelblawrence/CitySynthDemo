/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConnectHook } from '../common-core';
import Dial from './Dial';
//@ts-check

export const ConnectSnappyDial = ({ hook, segmentCount, ...props }) => ConnectHook(hook)(({ value, valueChanged }) => {
  const [_value, _setValue] = useState(value);
  useEffect(() => _setValue(value), [value]);
  const valueChangedHook = nextValue => {
    const snappedValue = Math.round(segmentCount * nextValue) / segmentCount;
    valueChanged(snappedValue);
  };
  const validateValue = nextValue => {
    const snapValue = Math.round(segmentCount * nextValue) / segmentCount;
    const outsideThreshold = Math.abs(snapValue - _value) > 0.05;
    _setValue(outsideThreshold ? snapValue : _value);
  };
  return <Dial {...props} value={_value} valueChanged={valueChangedHook} onValidateValue={validateValue} />;
});
ConnectSnappyDial.propTypes = {
  hook: PropTypes.array,
  segmentCount: PropTypes.number,
};
