//@ts-check
import React, { Component } from 'react';
import { Group } from 'react-konva';

import { HeaderText, Dial, ReduxDial } from '../components';
import { ctOrangeWithOpacity } from '../../../common';
import store from '../../../store';
import { setParamAttack, setParamDecay, setParamSustain, setParamRelease, setParamRate, setParamWidth } from '../../../redux/actions/AmpEnvActions';

const AmpEnvPanel = () => {
  return (
    <Group>
      <HeaderText x={219} y={300} width={62} centered>AMPLIFIER</HeaderText>

      <ReduxDial x={216} y={323} h={70} store={store} action={setParamAttack}>Attack</ReduxDial>
      <ReduxDial x={299} y={323} h={70} store={store} action={setParamDecay}>Decay</ReduxDial>
      <ReduxDial x={382} y={323} h={70} store={store} action={setParamSustain}>Sustain</ReduxDial>
      <ReduxDial x={465} y={323} h={70} store={store} action={setParamRelease}>Release</ReduxDial>
    </Group>
  );
}

const AmpLfoPanel = () => {
  return (
    <Group>
      <HeaderText x={349} y={465} width={38} centered
        fillColour={ctOrangeWithOpacity(120)}>LFO</HeaderText>

      <ReduxDial x={289} y={405} h={68} store={store} action={setParamRate}>Rate</ReduxDial>
      <ReduxDial x={392} y={405} h={68} store={store} action={setParamWidth}>Width</ReduxDial>
    </Group>
  );
}

export const AmpEnvGroupPanel = () => {
  return (
    <Group>
      <AmpEnvPanel />
      <AmpLfoPanel />
    </Group>
  );
}
