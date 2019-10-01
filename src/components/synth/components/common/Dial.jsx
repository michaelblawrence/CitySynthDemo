/* eslint-disable react/prop-types */
import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Group, Ellipse } from 'react-konva';
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

export class Dial extends Component {
  state = {
    text: 'Param',
    value: 0,
    inactive: true,
    mouseDown: false,
  };

  constructor(props) {
    super(props);

    const { text, w, h, value, children } = props;

    this.w = w || 57;
    this.h = h || 68;

    this.state.value = typeof value === 'number' ? value : this.state.value;

    this.state.text = typeof (text) === 'string'
      ? text
      : (typeof children === 'string' && children) || this.state.text;

    this.offsetY = 0;

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (prevProps.value !== value) {
      this.setState({ value });
    }
  }

  /**
   * @param {{evt: DragEvent}} evt 
   */
  handleDragMove({ evt }) {
    // @ts-check
    if (evt.which !== 1) {
      this.setState({ mouseDown: false });
      return;
    }
    if (!this.state.mouseDown) {
      return;
    }
    
    let offsetY = evt.offsetY;
    let dy = this.offsetY - offsetY;
    this.offsetY = offsetY;

    this.incrementStateValue(dy);

    evt.stopImmediatePropagation && evt.stopImmediatePropagation();
  }

  incrementStateValue(dy) {
    this.setState(state => {
      const nextValue = Math.round(state.value * 1000 + dy * 10) * 0.001;
      this.props.valueChanged
        && state.value !== nextValue
        && nextValue >= 0
        && nextValue <= 1
        && this.props.valueChanged(nextValue);
      return {
        value: clampNumber(nextValue),
      };
    });
  }

  /**
   * @param {{evt: DragEvent}} evt 
   */
  handleDragStart({ evt }) {
    this.offsetY = evt.offsetY;
    this.setState({ mouseDown: true, inactive: false });
  }

  /**
   * @param {{evt: DragEvent}} evt 
   */
  handleDragEnd() {
    if (!this.state.mouseDown) {
      return;
    }
    this.props.valueChanged
      && clampNumber(this.state.value)
      && this.props.valueChanged(this.state.value, true);
    typeof this.props.onValidateValue === 'function'
      && this.props.onValidateValue(this.state.value);
    console.warn('fired mouse up evt');
  }

  /**
   * @param {{evt: WheelEvent}} 
   */
  handleScroll({evt}) {
    evt.stopPropagation(); evt.stopImmediatePropagation();
    const nextY = -evt.wheelDeltaY;

    this.incrementStateValue(nextY * 0.5);
  }

  render() {
    const { x, y, hideBackground, noInactive } = this.props;
    const img_w = BackgroundImage.imgWidthPx;
    const bg_y = this.h - BackgroundImage.imgHeightPx;
    const rotation = clampNumber(this.state.value) * 274;
    /**
     * @param {TouchEvent} ev 
     */
    const touchStart = (ev) => this.handleDragStart({ evt: { ...ev.evt, clientY: ev.evt.touches && ev.evt.touches[0].clientY } });
    /**
     * @param {TouchEvent} ev 
     */
    const touchMove = (ev) => this.handleDragMove({ evt: { ...ev.evt, clientY: ev.evt.touches && ev.evt.touches[0].clientY, which: 1 } });
    /**
     * @param {TouchEvent} ev 
     */
    const touchEnd = (ev) => this.handleDragEnd({ evt: { ...ev.evt, clientY: ev.evt.touches && ev.evt.touches[0].clientY, which: 1 } });
    return (
      <Group x={x} y={y}
        onMouseDown={this.handleDragStart}
        onMouseMove={this.handleDragMove}
        onMouseUp={this.handleDragEnd}
        onWheel={this.handleScroll}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
        {hideBackground ? null : <BackgroundImage x={0} y={bg_y} />}
        <RoundDialImage x={0} y={bg_y} onMouseDown={this.handleDragStart} onMouseMove={this.handleDragMove} />
        <HeaderText
          x={0}
          y={2}
          centered={true}
          fillColour={{ r: 255, g: 255, b: 255, a: 255 }}
          width={this.w}
          height={this.h - 50}
        >{this.state.text}</HeaderText>
        {
          this.state.inactive && !noInactive
            ? <DialStandbyOverlay y={bg_y} onClick={() => this.setState(() => ({ inactive: false }))} />
            : null
        }
        <DialMarkerImage x={37 - img_w / 2} y={bg_y + 20} rotation={rotation} />
        {/* <Rect fill="rgba(0.1, 0.1, 0.1, 0.5)" width={this.w} height={this.h} /> */}
      </Group>
    );
  }
}
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
  children: PropTypes.node.isRequired
};
Dial.defaultProps = {
  value: 0
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