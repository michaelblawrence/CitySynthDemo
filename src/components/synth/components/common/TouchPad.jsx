//@ts-check
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group } from 'react-konva';

function TouchPadBackground(props) {
  return <AssetImage componentScope={'TouchPad'} assetName={'touchpad-bg'} {...props} />
};

export class TouchPad extends Component {
  state = {
  };

  /**
   * @param {{w: number, h: number, text?: string, children: React.ReactNode}} props
   */
  constructor(props) {
    super(props);
  }

  render() {
    const { x, y } = this.props;
    return (
      <Group x={x} y={y}>
        <TouchPadBackground />
      </Group>
    );
  }
}

TouchPad.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  enabled: PropTypes.bool,
};

TouchPad.defaultProps = {
  x: 0,
  y: 0,
  enabled: true,
};
