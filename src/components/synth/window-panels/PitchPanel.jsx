import React from 'react';
import { Group } from 'react-konva';

import { HeaderText, ConnectDial } from '../components';
import { createStoreHook } from '../../../redux/actions/helper';
import { Param } from '../../../redux/types';
import { setParamPitchRate, setParamPitchWidth } from '../../../redux/actions/PitchActions';

const PitchRateModHook = createStoreHook(Param.Pitchmod, setParamPitchRate, [0, 20]);
const PitchWidthModHook = createStoreHook(Param.PitchmodWidth, setParamPitchWidth, [0, 0.2]);

const PitchPanel = () => {
  return (
    <Group>
      <HeaderText x={131} y={300} width={37} centered>PITCH</HeaderText>

      <ConnectDial x={123} y={323} h={68} hook={PitchRateModHook}>Rate</ConnectDial>
      <ConnectDial x={123} y={400} h={68} hook={PitchWidthModHook}>Width</ConnectDial>
    </Group>
  );
};

export const PitchGroupPanel = () => {
  return (
    <Group>
      <PitchPanel />
    </Group>
  );
};