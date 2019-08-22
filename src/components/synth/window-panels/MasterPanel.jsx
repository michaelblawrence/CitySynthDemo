import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, Dial } from '../components';

class LfoPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={670} y={97} width={39} centered>LFO</HeaderText>

        <Dial x={673} y={123} h={68}>Rate</Dial>
        <Dial x={673} y={200} h={68}>Width</Dial>
      </Group>
    );
  }
}

class MasterPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={814} y={97}width={48} centered>MASTER</HeaderText>

        <Dial x={810} y={123} h={65} hideBackground noInactive>Level</Dial>
      </Group>
    );
  }
}

export class MasterGroupPanel extends Component {
  render() {
    return (
      <Group>
        <LfoPanel />
        <MasterPanel />
      </Group>
    );
  }
}