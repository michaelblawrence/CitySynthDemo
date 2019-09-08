import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, PanelDivider, WavePreviewBox, ReduxDial } from '../components';
import { setParamDelayLength, setParamDelayWetAmt } from '../../../redux/actions/OscActions';
import store from '../../../store';

class OscPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={131} y={97} width={38} centered>OSC 1</HeaderText>
        <WavePreviewBox x={131} y={120} />

        <ReduxDial x={127} y={186} h={83}>Wave Selector</ReduxDial>
        <ReduxDial x={193} y={200} h={69}>Phase</ReduxDial>
        <ReduxDial x={259} y={200} h={69}>Gain</ReduxDial>
      </Group>
    );
  }
}

class DelayPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={355} y={97} width={57} centered>DELAY</HeaderText>

        <ReduxDial x={355} y={123} h={68} store={store} action={setParamDelayLength}>Length</ReduxDial>
        <ReduxDial x={355} y={200} h={68} store={store} action={setParamDelayWetAmt}>Dry/Wet</ReduxDial>
      </Group>
    );
  }
}

export class OscGroupPanel extends Component {
  render() {
    return (
      <Group>
        <OscPanel />
        <PanelDivider x={331} y={110}/>
        <DelayPanel />
      </Group>
    );
  }
}