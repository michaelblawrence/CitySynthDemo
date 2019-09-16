import React from 'react';
import { Group } from 'react-konva';
import { HeaderText, ToggleIcon, PanelDivider, TouchPad, ConnectLogDial } from '../components';
import { setParamFilterCutoff } from '../../../redux/actions/FilterTouchActions';
import { createStoreHook } from '../../../redux/actions/helper';
import { Param } from '../../../redux/types';

const FilterCutoffHook = createStoreHook(Param.LPF, setParamFilterCutoff, [30, 21000]);

const FilterPanel = () => {
  return (
    <Group>
      <HeaderText x={572} y={300} width={39} centered>FILTER</HeaderText>

      <ConnectLogDial x={584} y={327} h={68} hook={FilterCutoffHook}>Cutoff</ConnectLogDial>
      <ToggleIcon x={584} y={421} w={57} h={34} enabled={false}>4-Pole</ToggleIcon>
    </Group>
  );
};

const HarmonicsCtrlPanel = () => {
  return (
    <Group>
      <HeaderText x={683} y={300} width={62} centered>TOUCHPAD</HeaderText>

      <ToggleIcon x={844} y={294} w={28} h={24} />
      <TouchPad x={683} y={323} />
    </Group>
  );
};

export const FilterTouchGroupPanel = () => {
  return (
    <Group>
      <FilterPanel />
      <PanelDivider x={670} y={315} />
      <HarmonicsCtrlPanel />
    </Group>
  );
};