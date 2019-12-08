/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConnectHook } from '../../common-core';
import Dial from './Dial';
//@ts-check

export const ConnectSnappyDial = ({ hook, segmentCount, ...props }) => ConnectHook(hook)(({ value, valueChanged }) => {
  const [min, max] = (hook && hook[2]) || [0, 1];

  const scaleFromUnit = value => (max - min) * value + min;
  const scaleToUnit = value => (value - min) / (max - min);

  const _value = (hook && (value || value !== 0) && scaleToUnit(value)) || 0;
  const _valueChanged = value => valueChanged(scaleFromUnit(value));
  const _validateValue = nextValue => _valueChanged(Math.round(segmentCount * nextValue) / segmentCount);

  return <Dial {...props} value={_value} valueChanged={_valueChanged} onValidateValue={_validateValue} />;
});
ConnectSnappyDial.propTypes = {
  hook: PropTypes.array,
  segmentCount: PropTypes.number,
};
