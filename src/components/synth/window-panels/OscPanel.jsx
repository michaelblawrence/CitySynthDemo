import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, Dial } from '../components';

class OscPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={131} y={97} width={38} centered>OSC 1</HeaderText>

        <Dial x={127} y={186} h={83}>Wave Selector</Dial>
        <Dial x={193} y={200} h={69}>Phase</Dial>
        <Dial x={259} y={200} h={69}>Gain</Dial>
      </Group>
    );
  }
}

class DelayPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={355} y={97} width={57} centered>DELAY</HeaderText>

        <Dial x={355} y={123} h={68}>Length</Dial>
        <Dial x={355} y={200} h={68}>Dry/Wet</Dial>
      </Group>
    );
  }
}

export class OscGroupPanel extends Component {
  render() {
    return (
      <Group>
        <OscPanel />
        <DelayPanel />
      </Group>
    );
  }
}