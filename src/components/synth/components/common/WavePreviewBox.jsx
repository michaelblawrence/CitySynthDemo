//@ts-check
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group, Line } from 'react-konva';
import { waveform$ } from '../../../../store';
import { clampNumber } from '../../../../common';

const WaveBoxBackground = (props) => {
  return <AssetImage componentScope={'WavePreviewBox'} assetName={'previewbox-bg'} {...props} />;
};
WaveBoxBackground.imgWidthPx = 178;
WaveBoxBackground.imgHeightPx = 51;

export const WavePreviewBox = ({ x, y }) => {
  const emptyArray = nItems => new Array(nItems).fill(0);
  const [points, setPoints] = useState(emptyArray(128 * 2));
  const gain = 12;

  useEffect(() => {
    const subscription = waveform$.subscribe(samples => {
      const pts = [];
      const maxIdx = samples.length - 1;
      const mid = WaveBoxBackground.imgHeightPx / 2;
      samples.forEach((sample, idx) => {
        const clipped = clampNumber(sample * gain, 1, -1);
        pts[idx * 2] = (WaveBoxBackground.imgWidthPx - (2)) * idx / maxIdx + 1;
        pts[idx * 2 + 1] = mid * (-clipped + 1);
      });
      setPoints(pts);
    });
    return () => subscription.unsubscribe();
  }, [gain]);
  return (
    <Group x={x} y={y}>
      <WaveBoxBackground />
      <Line points={points} strokeWidth={1.5} stroke={'#FFFFA5FF'} />
    </Group>
  );
};

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
