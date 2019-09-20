// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
import { Text, Group } from 'react-konva';
import { rgbaToHexCode } from '../../../../common';

/**
 * @param {{
 *  x: number;
 *  y: number;
 *  width: number;
 *  text: string;
 *  fillColour: { r: number, g: number, b: number, a?: number };
 *  centered: boolean;
 *  uppercase: boolean;
 *  children: React.ReactNode;
 * }} props
 */
export const HeaderText = (props) => {
  const { r, g, b, a } = props.fillColour;
  const color = rgbaToHexCode(r, g, b, a);
  const text = (typeof props.children === 'string' && props.children) || props.text;
  const transformedText = props.uppercase ? text.toUpperCase() : text;
  return (
    <Group
      x={props.x}
      y={props.y} >
      {/* <Rect width={props.width} height={20} fill="red" /> */}
      <Text
        text={transformedText}
        fontFamily={'Roboto Condensed, Roboto, Arial'}
        fontSize={13}
        fontStyle={'bold'}
        align={props.centered ? 'center' : undefined}
        fill={color}
        width={props.width}
      />
    </Group>
  );
};

HeaderText.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  text: PropTypes.string,
  centered: PropTypes.bool,
  uppercase: PropTypes.bool,
  children: PropTypes.node,
  fillColour: PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number,
    a: PropTypes.oneOfType([PropTypes.number, PropTypes.any]),
  })
};

HeaderText.defaultProps = {
  text: 'HeaderLabel',
  width: undefined,
  centered: false,
  uppercase: true,
  fillColour: { r: 238, g: 129, b: 12 },
};