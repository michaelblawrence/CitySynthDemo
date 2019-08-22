// @ts-check
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-konva';
import { rgbaToHexCode } from '../../../../common';

export class HeaderText extends Component {
  state = {
    text: 'HeaderLabel',
    fillColour: { r: 238, g: 129, b: 12 },
  };

  /**
   * @param {{
   *  x: number;
   *  y: number;
   *  width: number;
   *  text: string;
   *  fillColour: { r: number, g: number, b: number, a?: number };
   *  centered: boolean;
   *  children: React.ReactNode;
   * }} props
   */
  constructor(props) {
    super(props);
    const { text, fillColour, children } = props;
    this.state = {
      text: text || (typeof children === 'string' && children) || this.state.text,
      fillColour: fillColour || this.state.fillColour,
    };
    this.state.text = this.state.text.toUpperCase();
  }

  render() {
    const { r, g, b, a } = this.state.fillColour;
    const color = rgbaToHexCode(r, g, b, a);
    return (
      <Text
        text={this.state.text}
        x={this.props.x}
        y={this.props.y}
        fontFamily={'Roboto Condensed, Roboto, Arial'}
        fontSize={13}
        fontStyle={'bold'}
        align={this.props.centered ? 'center' : undefined}
        fill={color}
        width={this.props.width}
      />
    );
  }
}

HeaderText.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  text: PropTypes.string,
  centered: PropTypes.bool,
  fillColour: PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number,
  })
}


