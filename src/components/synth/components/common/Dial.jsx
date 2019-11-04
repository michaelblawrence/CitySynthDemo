/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Group, Ellipse, Rect } from 'react-konva';
import { AssetImage } from '../features';
import { HeaderText } from './HeaderText';
import { rgbaToHexCode, clampNumber } from '../../../../common';
import { ConnectHook } from '../common-core';

const BackgroundImage = (props) => {
  const { ...other } = props;
  return <AssetImage componentScope={'Dial'} assetName={'dial-bg-markings'} {...other} />;
};
BackgroundImage.imgWidthPx = 57;
BackgroundImage.imgHeightPx = 65;

const RoundDialImage = (props) => {
  const { ...other } = props;
  return <AssetImage componentScope={'Dial'} assetName={'round-blank-dial'} {...other} />;
};
RoundDialImage.imgWidthPx = 57;
RoundDialImage.imgHeightPx = 65;

const DialMarkerImage = (props) => {
  const { x, y, ...other } = props;
  const offset = {
    x: 20,
    y: 20,
  };
  return (
    <AssetImage componentScope={'Dial'} assetName={'dial-fg-marker'} {...other}
      x={x + offset.x} y={y + offset.y} offsetX={offset.x} offsetY={offset.y} />
  );
};
DialMarkerImage.imgWidthPx = 39;
DialMarkerImage.imgHeightPx = 39;
DialMarkerImage.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
};

function DialStandbyOverlay(props) {
  const { x, y } = props;
  return (
    <Ellipse
      x={x + 56 - BackgroundImage.imgWidthPx / 2.0}
      y={y + 104 - BackgroundImage.imgHeightPx}
      width={DialMarkerImage.imgWidthPx}
      height={DialMarkerImage.imgHeightPx}
      fill={rgbaToHexCode(45, 45, 45, 190)}
      onClick={props.onClick}
    />
  );
}
DialStandbyOverlay.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  onClick: PropTypes.func,
};
DialStandbyOverlay.defaultProps = {
  x: 0,
  y: 0,
};

//@ts-check

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
   * @param {{evt: WheelEvent}} 
   */
  const handleScroll = ({ evt }) => {
    evt.stopPropagation(); evt.stopImmediatePropagation();
    const nextY = -evt.wheelDeltaY;

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
    console.warn('fired mouse up evt');
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
      <Rect fill="rgba(0.1, 0.1, 0.1, 0.5)" width={w} height={h} draggable={true}
        onDragStart={handleDragRectStart}
        onDragMove={handleDragRectMove}
        onDragEnd={handleDragRectEnd} />
    </Group>
  );
};
const DialBackground = ({ w, h, hideBackground, text, isInactive, noInactive, setInactive }) => {
  const bg_y = h - BackgroundImage.imgHeightPx;
  return [
    hideBackground ? null : <BackgroundImage x={0} y={bg_y} key={'bg_1'} />,
    <RoundDialImage x={0} y={bg_y} key={'bg_2'} />,
    <HeaderText
      x={0}
      y={2}
      centered={true}
      fillColour={{ r: 255, g: 255, b: 255, a: 255 }}
      width={w}
      height={h - 50}
      key={'bg_3'}
    >{text}</HeaderText>,
    isInactive && !noInactive
      ? <DialStandbyOverlay y={bg_y} onClick={() => setInactive(false)} key={'bg_4'} />
      : null
  ];
};
DialBackground.propTypes = {
  w: PropTypes.number,
  h: PropTypes.number,
  hideBackground: PropTypes.bool,
  text: PropTypes.string,
  isInactive: PropTypes.bool,
  noInactive: PropTypes.bool,
  setInactive: PropTypes.func
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

export const ReduxDial = ({ store, action, ...others }) => {
  const handleValueChanged = (value) => store.dispatch(action(value));
  return <Dial {...others} valueChanged={handleValueChanged} />;
};
ReduxDial.propTypes = {
  store: PropTypes.object,
  action: PropTypes.func,
};

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
export default Dial;