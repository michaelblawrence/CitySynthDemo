/* eslint-disable react/prop-types */
import React, { } from 'react';
import { ConnectHook } from '../../common-core';
import Dial from './Dial';

export const ConnectLogDial = ({ hook, ...props }) => ConnectHook(hook)(({ value, valueChanged }) => {
  const range = (hook && hook[2]) || [0, 1];
  const [min, max] = range.map(bound => Math.log(bound));

  const scaleFromUnit = value => (max - min) * value + min;
  const scaleToUnit = value => (value - min) / (max - min);

  const logValue = Math.log(value);
  const _value = (hook && (value || value !== 0) && scaleToUnit(logValue)) || 0;
  const _valueChanged = value => valueChanged(Math.exp(scaleFromUnit(value)));

  return <Dial {...props} value={_value} valueChanged={_valueChanged} />;
});