//@ts-check
import React, { Component } from 'react';
import { Group } from 'react-konva';

import { HeaderText, Dial, ReduxDial, HookedDial } from '../components';
import { ctOrangeWithOpacity } from '../../../common';
import store from '../../../store';
import { setParamAttack, setParamDecay, setParamSustain, setParamRelease, setParamRate, setParamWidth } from '../../../redux/actions/AmpEnvActions';
import { Param } from '../../../redux/types';

const AttackHook      = [(state) => state[Param.Attack],          setParamAttack,  [1, 1500]]; 
const DecayHook       = [(state) => state[Param.Decay],           setParamDecay,   [5, 1500]]; 
const SustainHook     = [(state) => state[Param.Sustain],         setParamSustain, [0, 1]]; 
const ReleaseHook     = [(state) => state[Param.Release],         setParamRelease, [2, 1500]];
const AmpLFORateHook  = [(state) => state[Param.AmpLFOrate],      setParamRate,    [1, 1500]]; 
const AmpLFOWidthHook   = [(state) => state[Param.AmpLFOwidth],   setParamWidth,   [5, 1500]]; 

const AmpEnvPanel = () => {
  return (
    <Group>
      <HeaderText x={219} y={300} width={62} centered>AMPLIFIER</HeaderText>

      <HookedDial x={216} y={323} h={70} store={store} hook={AttackHook}>Attack</HookedDial>
      <HookedDial x={299} y={323} h={70} store={store} hook={DecayHook}>Decay</HookedDial>
      <HookedDial x={382} y={323} h={70} store={store} hook={SustainHook}>Sustain</HookedDial>
      <HookedDial x={465} y={323} h={70} store={store} hook={ReleaseHook}>Release</HookedDial>
    </Group>
  );
}

const AmpLfoPanel = () => {
  return (
    <Group>
      <HeaderText x={349} y={465} width={38} centered
        fillColour={ctOrangeWithOpacity(120)}>LFO</HeaderText>

      <HookedDial x={289} y={405} h={68} store={store} hook={AmpLFORateHook}>Rate</HookedDial>
      <HookedDial x={392} y={405} h={68} store={store} hook={AmpLFOWidthHook}>Width</HookedDial>
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
