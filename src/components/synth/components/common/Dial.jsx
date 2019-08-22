import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Group, Ellipse, Rect } from 'react-konva';
import { AssetImage } from '../features';
import { HeaderText } from './HeaderText';
import { rgbaToHexCode } from '../../../../common';

const BackgroundImage = (props) => {
  const { ...other } = props;
  return <AssetImage componentScope={'Dial'} assetName={'dial-bg-markings'} {...other} />
};
BackgroundImage.imgWidthPx = 57;
BackgroundImage.imgHeightPx = 65;

const RoundDialImage = (props) => {
  const { ...other } = props;
  return <AssetImage componentScope={'Dial'} assetName={'round-blank-dial'} {...other} />
};
RoundDialImage.imgWidthPx = 57;
RoundDialImage.imgHeightPx = 65;

function DialStandbyOverlay(props) {
  const { x, y } = props;
  return (
    <Ellipse
      x={x + 55 - BackgroundImage.imgWidthPx / 2.0}
      y={y + 104 - BackgroundImage.imgHeightPx}
      width={38}
      height={38}
      fill={rgbaToHexCode(45, 45, 45, 190)}
      onClick={props.onClick}
    />
  );
}

DialStandbyOverlay.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
}

DialStandbyOverlay.defaultProps = {
  x: 0,
  y: 0,
}

export class Dial extends Component {
  state = {
    text: 'Param',
    inactive: true,
  };
  constructor(props) {
    super(props);

    const { text, w, h, children } = props;

    this.w = w || 57;
    this.h = h || 68;

    this.state.text = typeof (text) === 'string'
      ? text
      : (typeof children === 'string' && children) || this.state.text;
  }
  render() {
    let { x, y, hideBackground, noInactive } = this.props;
    let bg_y = this.h - BackgroundImage.imgHeightPx;
    return (
      <Group x={x} y={y}>
        <RoundDialImage x={0} y={bg_y} />
        {hideBackground ? null : <BackgroundImage x={0} y={bg_y} />}
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
        {/* <Rect fill="rgba(0.1, 0.1, 0.1, 0.5)" width={this.w} height={this.h} /> */}
      </Group>
    );
  }
}

Dial.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  w: PropTypes.number,
  h: PropTypes.number,
  text: PropTypes.string,
  hideBackground: PropTypes.bool,
  noInactive: PropTypes.bool,
};
