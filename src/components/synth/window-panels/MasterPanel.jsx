import React from 'react';
import { Group } from 'react-konva';
import { HeaderText, Dial, ToggleIcon, PanelDivider, ConnectDial, ConnectLogDial } from '../components';
import { ctOrangeWithOpacity } from '../../../common';
import { createStoreHook } from '../../../redux/actions/helper';
import { Param } from '../../../redux/types';
import { setParamFilterModeWidth, setParamFilterModRate, setParamMasterLevel } from '../../../redux/actions/MasterActions';

const FilterModRateHook = createStoreHook(Param.LPFmodrate, setParamFilterModRate, [0, 20]);
const FilterCutoffHook = createStoreHook(Param.LPFwidth, setParamFilterModeWidth, [10, 15000]);
// const FilterCutoffHook = createStoreHook(Param.LPF, setParamFilterCutoff, [5, 21000]);

const LfoPanel = () => {
  return (
    <Group>
      <HeaderText x={670} y={97} width={39} centered>LFO</HeaderText>

      <HeaderText x={728} y={153} width={67} centered
        fillColour={ctOrangeWithOpacity(120)}>Send To:</HeaderText>
      <ToggleIcon x={733} y={170} w={57} h={34}>LPF</ToggleIcon>
      <ToggleIcon x={733} y={208} w={57} h={34}>HPF</ToggleIcon>

      <ConnectDial x={673} y={123} h={68} hook={FilterModRateHook}>Rate</ConnectDial>
      <ConnectDial x={673} y={200} h={68} hook={FilterCutoffHook}>Width</ConnectDial>
    </Group>
  );
};

const MasterLevelHook = createStoreHook(Param.Gain, setParamMasterLevel, [0, 1]);

const MasterPanel = () => {
  // todo: continue master level dial
  return (
    <Group>
      <HeaderText x={814} y={97} width={48} centered>MASTER</HeaderText>

      <ConnectLogDial x={810} y={123} h={65} hook={MasterLevelHook}>Level</ConnectLogDial>
    </Group>
  );
};

export const MasterGroupPanel = () => {
  return (
    <Group>
      <LfoPanel />
      <PanelDivider x={791} y={110} />
      <MasterPanel />
    </Group>
  );
};