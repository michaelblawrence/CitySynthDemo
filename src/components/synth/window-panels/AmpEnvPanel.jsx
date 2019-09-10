//@ts-check
import React from 'react';
import { Group } from 'react-konva';

import { HeaderText, ConnectDial } from '../components';
import { ctOrangeWithOpacity } from '../../../common';
import { setParamAttack, setParamDecay, setParamSustain, setParamRelease, setParamRate, setParamWidth } from '../../../redux/actions/AmpEnvActions';
import { Param, InversedParam } from '../../../redux/types';

const createHook = (param, actionCreator, [min, max]) => [(state) => state[InversedParam[param]], actionCreator, [min, max]]

const AttackHook = createHook(Param.Attack, setParamAttack, [1, 1500]);
const DecayHook = createHook(Param.Decay, setParamDecay, [0, 1]);
const SustainHook = createHook(Param.Sustain, setParamSustain, [2, 1500]);
const ReleaseHook = createHook(Param.Release, setParamRelease, [1, 1500]);
const AmpLFORateHook = createHook(Param.AmpLFOrate, setParamRate, [5, 1500]);
const AmpLFOWidthHook = createHook(Param.AmpLFOwidth, setParamWidth, [0, 1]);

const AmpEnvPanel = () => {
  return (
    <Group>
      <HeaderText x={219} y={300} width={62} centered>AMPLIFIER</HeaderText>

      <ConnectDial x={216} y={323} h={70} hook={AttackHook}>Attack</ConnectDial>
      <ConnectDial x={299} y={323} h={70} hook={DecayHook}>Decay</ConnectDial>
      <ConnectDial x={382} y={323} h={70} hook={SustainHook}>Sustain</ConnectDial>
      <ConnectDial x={465} y={323} h={70} hook={ReleaseHook}>Release</ConnectDial>
    </Group>
  );
}

const AmpLfoPanel = () => {
  return (
    <Group>
      <HeaderText x={349} y={465} width={38} centered
        fillColour={ctOrangeWithOpacity(120)}>LFO</HeaderText>

      <ConnectDial x={289} y={405} h={68} hook={AmpLFORateHook}>Rate</ConnectDial>
      <ConnectDial x={392} y={405} h={68} hook={AmpLFOWidthHook}>Width</ConnectDial>
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
