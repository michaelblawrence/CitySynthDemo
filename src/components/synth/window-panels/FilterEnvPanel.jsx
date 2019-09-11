import React, { Component } from 'react';
import { Group } from 'react-konva';
import { HeaderText, ToggleIcon, ConnectDial } from '../components';
import { setParamFilterAttack, setParamFilterCeiling, setParamFilterFloor, setParamFilterRelease } from '../../../redux/actions/FilterEnvActions';
import { Param } from '../../../redux/types';
import { createStoreHook } from '../../../redux/actions/helper';

const AttackHook = createStoreHook(Param.LPFattack, setParamFilterAttack, [5, 1500]);
const ReleaseHook = createStoreHook(Param.LPFrelease, setParamFilterRelease, [5, 1500]);
const EnvFloorHook = createStoreHook(Param.LPFfloor, setParamFilterFloor, [5, 21000]);
const EnvCeilingHook = createStoreHook(Param.LPFceiling, setParamFilterCeiling, [5, 21000]);

class EnvPanel extends Component {
  render() {
    return (
      <Group>
        <HeaderText x={460} y={97} width={62}>ENVELOPE</HeaderText>
        <ToggleIcon x={619} y={90} w={28} h={24} />

        <ConnectDial x={471} y={123} h={70} hook={AttackHook}>Attack</ConnectDial>
        <ConnectDial x={570} y={123} h={70} hook={ReleaseHook}>Release</ConnectDial>
        <ConnectDial x={471} y={200} h={70} hook={EnvFloorHook}>Floor</ConnectDial>
        <ConnectDial x={570} y={200} h={70} hook={EnvCeilingHook}>Ceiling</ConnectDial>
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