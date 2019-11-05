/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../../features';
import { rgbaToHexCode } from '../../../../../common';
import { Ellipse } from 'react-konva';

export const BackgroundImage = (props) => {
  const { ...other } = props;
  return <AssetImage componentScope={'Dial'} assetName={'dial-bg-markings'} {...other} />;
};
BackgroundImage.imgWidthPx = 57;
BackgroundImage.imgHeightPx = 65;

export const RoundDialImage = (props) => {
  const { ...other } = props;
  return <AssetImage componentScope={'Dial'} assetName={'round-blank-dial'} {...other} />;
};
RoundDialImage.imgWidthPx = 57;
RoundDialImage.imgHeightPx = 65;

export const DialMarkerImage = (props) => {
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

export const DialStandbyOverlay = (props) => {
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
};
DialStandbyOverlay.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  onClick: PropTypes.func,
};
DialStandbyOverlay.defaultProps = {
  x: 0,
  y: 0,
};