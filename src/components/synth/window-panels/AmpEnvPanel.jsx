//@ts-check
import React from 'react';
import { Group } from 'react-konva';

import { HeaderText, ConnectDial } from '../components';
import { ctOrangeWithOpacity } from '../../../common';
import { setParamAttack, setParamDecay, setParamSustain, setParamRelease, setParamRate, setParamWidth } from '../../../redux/actions/AmpEnvActions';
import { Param } from '../../../redux/types';
import { createStoreHook } from '../../../redux/actions/helper';

const AttackHook = createStoreHook(Param.Attack, setParamAttack, [1, 1500]);
const DecayHook = createStoreHook(Param.Decay, setParamDecay, [2, 1500]);
const SustainHook = createStoreHook(Param.Sustain, setParamSustain, [0, 1]);
const ReleaseHook = createStoreHook(Param.Release, setParamRelease, [1, 1500]);
const AmpLFORateHook = createStoreHook(Param.AmpLFOrate, setParamRate, [5, 1500]);
const AmpLFOWidthHook = createStoreHook(Param.AmpLFOwidth, setParamWidth, [0, 1]);

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
