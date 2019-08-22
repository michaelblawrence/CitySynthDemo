import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, ToggleIcon, Dial } from '../components';

class EnvPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={460} y={97}>ENVELOPE</HeaderText>
        <ToggleIcon x={619} y={90} w={28} h={24} />

        <Dial x={471} y={123} h={70}>Attack</Dial>
        <Dial x={570} y={123} h={70}>Release</Dial>
        <Dial x={471} y={200} h={70}>Floor</Dial>
        <Dial x={570} y={200} h={70}>Ceiling</Dial>
      </Group>
    );
  }
}

export class EnvGroupPanel extends Component {
  render() {
    return (
      <Group>
        <EnvPanel />
      </Group>
    );
  }
}