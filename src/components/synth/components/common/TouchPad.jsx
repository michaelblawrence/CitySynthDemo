//@ts-check
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group } from 'react-konva';
import { clampNumber } from '../../../../common';

const TouchPadBackground = (props) => {
  return <AssetImage componentScope={'TouchPad'} assetName={'touchpad-bg'} {...props} />;
};
TouchPadBackground.imgWidthPx = 184;
TouchPadBackground.imgHeightPx = 147;

export const TouchPad = ({ x, y, hValue, vValue, sensitivity, valueChanged }) => {
  const [mouseDown, setIsMouseDown] = useState(false);
  const [prevOffset, setPrevOffset] = useState({ x: 0, y: 0 });
  const [value, setValue] = useState({ hValue, vValue });
  /**
   * @param {{evt: MouseEvent}} e
   */
  const handleDragStart = ({ evt }) => {
    if (evt.which === 1) {
      setIsMouseDown(true);
    }
    const { offsetX, offsetY } = evt;
    setPrevOffset({ x: offsetX, y: offsetY });
  };

  /**
   * @param {{evt: MouseEvent}} e
   */
  const handleDragMove = ({ evt }) => {
    if (evt.which !== 1) {
      setIsMouseDown(false);
      return;
    }
    if (!mouseDown) {
      return;
    }
    const { offsetX, offsetY } = evt;
    const dx = offsetX - prevOffset.x;
    const dy = offsetY - prevOffset.y;

    const nextValue = {
      hValue: clampNumber(sensitivity * (dx / TouchPadBackground.imgWidthPx) + value.hValue),
      vValue: clampNumber(sensitivity * (dy / TouchPadBackground.imgHeightPx) + value.vValue),
    };

    setValue(nextValue);

    typeof valueChanged === 'function'
      && valueChanged(nextValue);

    setPrevOffset({ x: offsetX, y: offsetY });
  };

  /**
   * @param {{evt: MouseEvent}} e
   */
  const handleDragEnd = ({ evt }) => {
    if (!mouseDown) {
      return;
    }
  };
  return (
    <Group x={x} y={y}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
    >
      <TouchPadBackground />
    </Group>
  );
};

TouchPad.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  enabled: PropTypes.bool,
  hValue: PropTypes.number,
  vValue: PropTypes.number,
  sensitivity: PropTypes.number,
  valueChanged: PropTypes.func,
};

TouchPad.defaultProps = {
  x: 0,
  y: 0,
  enabled: true,
  hValue: 0,
  vValue: 0,
  sensitivity: 0.5,
  valueChanged: () => {},
};
