import React, { Component } from 'react';
import { Layer, Stage, Group } from 'react-konva';
import { AssetImage } from '../features';

const BackgroundImage = () => {
  return <AssetImage componentScope={'BaseWindow'} assetName={'base-bg-img'} />
};

export class BaseWindow extends Component {
  state = {
  };
  render() {
    return (
      <Stage width={925} height={528}>
        <Layer>
          <Group>
            <BackgroundImage />
            <Group y={3}>
              {this.props.children}
            </Group>
          </Group>
        </Layer>
      </Stage>
    );
  }
}