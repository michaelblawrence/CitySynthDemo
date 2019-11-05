/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { HeaderText } from './../HeaderText';
import { BackgroundImage, RoundDialImage, DialStandbyOverlay } from './Dial.assets';

export const DialBackground = ({ w, h, hideBackground, text, isInactive, noInactive, setInactive }) => {
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