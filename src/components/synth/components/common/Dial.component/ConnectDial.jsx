/* eslint-disable react/prop-types */
import React, { } from 'react';
import PropTypes from 'prop-types';
import { ConnectHook } from '../../common-core';
import Dial from './Dial';

export const ConnectDial = ({ hook, ...props }) => ConnectHook(hook)(({ value, valueChanged }) => {
  const [min, max] = (hook && hook[2]) || [0, 1];

  const scaleFromUnit = value => (max - min) * value + min;
  const scaleToUnit = value => (value - min) / (max - min);

  const _value = (hook && (value || value !== 0) && scaleToUnit(value)) || 0;
  const _valueChanged = value => valueChanged(scaleFromUnit(value));

  return <Dial {...props} value={_value} valueChanged={_valueChanged} />;
});
ConnectDial.propTypes = {
  hook: PropTypes.array,
};