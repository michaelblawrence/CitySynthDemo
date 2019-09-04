import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, Dial } from '../components';

class PitchPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={131} y={300} width={37} centered>PITCH</HeaderText>

        <Dial x={123} y={323} h={68}>Rate</Dial>
        <Dial x={123} y={400} h={68}>Width</Dial>
      </Group>
    );
  }
}

export class PitchGroupPanel extends Component {
  render() {
    return (
      <Group>
        <PitchPanel />
      </Group>
    );
  }
}