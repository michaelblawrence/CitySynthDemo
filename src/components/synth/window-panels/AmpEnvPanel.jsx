import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, Dial } from '../components';
import { ctOrangeWithOpacity } from '../../../common';

class AmpEnvPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={219} y={300}width={62} centered>AMPLIFIER</HeaderText>

        <Dial x={216} y={323} h={70}>Attack</Dial>
        <Dial x={299} y={323} h={70}>Decay</Dial>
        <Dial x={382} y={323} h={70}>Sustain</Dial>
        <Dial x={465} y={323} h={70}>Release</Dial>
      </Group>
    );
  }
}

class AmpLfoPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={349} y={465} width={38} centered
          fillColour={ctOrangeWithOpacity(120)}>LFO</HeaderText>

        <Dial x={289} y={405} h={68}>Rate</Dial>
        <Dial x={392} y={405} h={68}>Width</Dial>
      </Group>
    );
  }
}

export class AmpEnvGroupPanel extends Component {
  render() {
    return (
      <Group>
        <AmpEnvPanel />
        <AmpLfoPanel />
      </Group>
    );
  }
}