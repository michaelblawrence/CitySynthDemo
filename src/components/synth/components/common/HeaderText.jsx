// @ts-check
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Group } from 'react-konva';
import { rgbaToHexCode } from '../../../../common';

export class HeaderText extends Component {
  state = {
    text: 'HeaderLabel',
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
    const { text, children } = props;
    this.state = {
      text: text || (typeof children === 'string' && children) || this.state.text,
    };
    this.state.text = this.state.text.toUpperCase();
  }

  render() {
    const { r, g, b, a } = this.props.fillColour;
    const color = rgbaToHexCode(r, g, b, a);
    return (
      <Group
        x={this.props.x}
        y={this.props.y} >
        {/* <Rect width={this.props.width} height={20} fill="red" /> */}
        <Text
          text={this.state.text}
          fontFamily={'Roboto Condensed, Roboto, Arial'}
          fontSize={13}
          fontStyle={'bold'}
          align={this.props.centered ? 'center' : undefined}
          fill={color}
          width={this.props.width}
        />
      </Group>
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

HeaderText.defaultProps = {
  fillColour: { r: 238, g: 129, b: 12 },
}