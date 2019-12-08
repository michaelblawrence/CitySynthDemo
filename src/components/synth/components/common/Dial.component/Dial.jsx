/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Group, Rect } from 'react-konva';
import { clampNumber } from '../../../../../common';
import { DialMarkerImage, BackgroundImage } from './Dial.assets';
import { DialBackground } from './DialBackground';

export const Dial = ({ text: propText, children, w, h, value: propValue, valueChanged, onValidateValue, x, y, hideBackground, noInactive }) => {
  const [value, setValue] = useState(propValue);
  const [rectY, setRectY] = useState(0);
  const [isInactive, setInactive] = useState(!noInactive);

  const text = children || propText;

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const incrementStateValue = (dy) => {
    setValue((oldValue) => {
      const nextValue = Math.round(oldValue * 1000 + dy * 10) * 0.001;
      valueChanged
        && oldValue !== nextValue
        && nextValue >= 0
        && nextValue <= 1
        && valueChanged(clampNumber(nextValue));
      return clampNumber(nextValue);
    });
  };

  /**
   * @param {{evt: WheelEvent}} e
   */
  const handleScroll = ({ evt }) => {
    evt.stopPropagation(); evt.stopImmediatePropagation();
    const nextY = -evt.deltaY;

    incrementStateValue(nextY * 0.5);
  };

  /**
   * @param {import('konva/types/Node').KonvaEventObject<DragEvent>} evt 
   */
  const handleDragRectMove = (evt) => {
    // @ts-check
    const nextRectY = evt.target.y();
    const dy = rectY === null ? 0 : rectY - nextRectY;
    setRectY(nextRectY);

    incrementStateValue(dy);
  };

  const handleDragRectStart = () => {
    // @ts-check
    setRectY(null);
  };

  /**
   * @param {import('konva/types/Node').KonvaEventObject<DragEvent>} evt 
   */
  const handleDragRectEnd = (evt) => {
    // @ts-check
    evt.target.x(0);
    evt.target.y(0);

    typeof onValidateValue === 'function'
      && onValidateValue(value);
  };

  const img_w = BackgroundImage.imgWidthPx;
  const bg_y = h - BackgroundImage.imgHeightPx;
  const rotation = (clampNumber(value) || 0) * 274;
  // console.warn({ value, rotation })
  return (
    <Group x={x} y={y}
      onWheel={handleScroll}
    >
      <DialBackground w={w} h={h} hideBackground={hideBackground} text={text} isInactive={isInactive}
        noInactive={noInactive} setInactive={setInactive} />
      <DialMarkerImage x={37 - img_w / 2} y={bg_y + 20} rotation={rotation} />
      <Rect
        // fill="rgba(0.1, 0.1, 0.1, 0.5)"
        width={w} height={h} draggable={true}
        onDragStart={handleDragRectStart}
        onDragMove={handleDragRectMove}
        onDragEnd={handleDragRectEnd} />
    </Group>
  );
};

Dial.propTypes = {
  value: PropTypes.number,
  valueChanged: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
  w: PropTypes.number,
  h: PropTypes.number,
  text: PropTypes.string,
  hideBackground: PropTypes.bool,
  noInactive: PropTypes.bool,
};
Dial.defaultProps = {
  text: 'Param',
  value: 0,
  inactive: true,
  mouseDown: false,
  w: 57,
  h: 68,
};

export default Dial;