/* eslint-disable react/prop-types */
import React, { } from 'react';
import PropTypes from 'prop-types';
import Dial from './Dial';
//@ts-check

export const ReduxDial = ({ store, action, ...others }) => {
  const handleValueChanged = (value) => store.dispatch(action(value));
  return <Dial {...others} valueChanged={handleValueChanged} />;
};
ReduxDial.propTypes = {
  store: PropTypes.object,
  action: PropTypes.func,
};