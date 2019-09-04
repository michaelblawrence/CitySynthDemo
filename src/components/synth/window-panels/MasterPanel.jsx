import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, Dial, ToggleIcon, PanelDivider } from '../components';
import { ctOrangeWithOpacity } from '../../../common';

class LfoPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={670} y={97} width={39} centered>LFO</HeaderText>

        <HeaderText  x={728} y={153} width={67} centered
          fillColour={ctOrangeWithOpacity(120)}>Send To:</HeaderText>
        <ToggleIcon x={733} y={170} w={57} h={34}>LPF</ToggleIcon>
        <ToggleIcon x={733} y={208} w={57} h={34}>HPF</ToggleIcon>

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
        <PanelDivider x={791} y={110}/>
        <MasterPanel />
      </Group>
    );
  }
}