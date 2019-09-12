//@ts-check
import React from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group } from 'react-konva';

const TouchPadBackground = (props) => {
  return <AssetImage componentScope={'TouchPad'} assetName={'touchpad-bg'} {...props} />;
};

export const TouchPad = ({ x, y }) => {
  return (
    <Group x={x} y={y}>
      <TouchPadBackground />
    </Group>
  );
};

TouchPad.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  enabled: PropTypes.bool,
};

TouchPad.defaultProps = {
  x: 0,
  y: 0,
  enabled: true,
};
