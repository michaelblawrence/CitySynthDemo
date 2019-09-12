//@ts-check
import React from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group } from 'react-konva';

function WaveBoxBackground(props) {
  return <AssetImage componentScope={'WavePreviewBox'} assetName={'previewbox-bg'} {...props} />
};

export const WavePreviewBox = ({ x, y }) => {
  return (
    <Group x={x} y={y}>
      <WaveBoxBackground />
    </Group>
  );
}

WavePreviewBox.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  enabled: PropTypes.bool,
};

WavePreviewBox.defaultProps = {
  x: 0,
  y: 0,
  enabled: true,
};
