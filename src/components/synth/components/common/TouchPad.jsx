//@ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group } from 'react-konva';
import { clampNumber } from '../../../../common';
import { ConnectHook } from '../common-core';

const TouchPadBackground = (props) => {
  return <AssetImage componentScope={'TouchPad'} assetName={'touchpad-bg'} {...props} />;
};
TouchPadBackground.imgWidthPx = 184;
TouchPadBackground.imgHeightPx = 147;

export const TouchPad = ({ x, y, enabled, hValue, vValue, sensitivity, tapToToggle, valueChanged, enabledChanged }) => {
  const [mouseDown, setIsMouseDown] = useState(false);
  const [prevOffset, setPrevOffset] = useState({ x: 0, y: 0 });
  const [value, setValue] = useState({ hValue, vValue });
  const [_toggleEnabled, setToggle] = useState(enabled);
  const toggleEnabled = tapToToggle ? _toggleEnabled : enabled;

  useEffect(() => setToggle(enabled), [enabled]);
  /**
   * @param {{evt: MouseEvent}} e
   */
  const handleDragStart = ({ evt }) => {
    if (evt.which === 1) {
      setIsMouseDown(true);
    }
    const { offsetX, offsetY } = evt;
    setPrevOffset({ x: offsetX, y: offsetY });
    const nextToggleState = !toggleEnabled;
    if (_toggleEnabled !== nextToggleState && typeof enabledChanged === 'function') {
      enabledChanged(nextToggleState);
    }
    setToggle(nextToggleState);
  };

  /**
   * @param {{evt: MouseEvent}} e
   */
  const handleDragMove = ({ evt }) => {
    if (!toggleEnabled) {
      if (evt.which !== 1) {
        setIsMouseDown(false);
        return;
      }
      if (!mouseDown) {
        return;
      }
    }
    const { offsetX, offsetY } = evt;
    const dx = offsetX - prevOffset.x;
    const dy = offsetY - prevOffset.y;

    const nextValue = {
      hValue: clampNumber(sensitivity * (dx / TouchPadBackground.imgWidthPx) + value.hValue),
      vValue: clampNumber(sensitivity * (dy / TouchPadBackground.imgHeightPx) + value.vValue),
    };
    const hasValueChanged = (nextValue.hValue !== value.hValue || nextValue.vValue !== value.vValue);
    setValue(nextValue);

    typeof valueChanged === 'function'
      && hasValueChanged
      && valueChanged(nextValue);

    setPrevOffset({ x: offsetX, y: offsetY });
  };

  const handleDragEnd = () => {
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
  tapToToggle: PropTypes.bool,
  hValue: PropTypes.number,
  vValue: PropTypes.number,
  sensitivity: PropTypes.number,
  valueChanged: PropTypes.func,
  enabledChanged: PropTypes.func,
};

TouchPad.defaultProps = {
  x: 0,
  y: 0,
  enabled: true,
  tapToToggle: false,
  hValue: 0,
  vValue: 0,
  sensitivity: 0.5,
};

export const ConnectTouchPad = ({ hHook, vHook, hLogScale, vLogScale, ...props }) => {
  const splitHandle = ({ hValueChanged, vValueChanged }) =>
    ({ hValue, vValue }) => { hValueChanged(hValue); vValueChanged(vValue); };

  const XYHook = ConnectHook(hHook, 0, true, hLogScale)(
    ({ value: hValue, valueChanged: hValueChanged }) =>
      ConnectHook(vHook, 0, true, vLogScale)(
        ({ value: vValue, valueChanged: vValueChanged }) =>
          <TouchPad {...props}
            hValue={hValue}
            vValue={vValue}
            valueChanged={splitHandle({ hValueChanged, vValueChanged })}
          />
      )
  );

  return XYHook;
};

ConnectTouchPad.propTypes = {
  hHook: PropTypes.array,
  vHook: PropTypes.array,
  hLogScale: PropTypes.bool,
  vLogScale: PropTypes.bool,
};

export const ToggleConnectTouchPad = ({ hHook, vHook, hLogScale, vLogScale, toggleHook, ...props }) =>
  ConnectHook(toggleHook)(({ value: enabled, valueChanged: enableChanged }) => {
    const _enabled = (toggleHook && (enabled || enabled !== 0) && enabled > 0.5) || false;
    const _enableChanged = checked => enableChanged(+checked);

    return <ConnectTouchPad {...props}
      hHook={hHook} vHook={vHook} hLogScale={hLogScale} vLogScale={vLogScale}
      enabledChanged={_enableChanged} enabled={_enabled} />;
  });
