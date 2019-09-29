import React, { useState } from 'react';
import { Group } from 'react-konva';

import { HeaderText, PanelDivider, WavePreviewBox, ReduxDial, ConnectDial, ToggleIcon } from '../components';
import { setParamDelayLength, setParamDelayWetAmt, setParamOscPhase, setParamOscWaveFunction, setParamOscGain, setParamReverbWetAmt } from '../../../redux/actions/OscActions';
import store from '../../../store';
import { createStoreHook } from '../../../redux/actions/helper';
import { Param } from '../../../redux/types';

const OscPhaseHook = createStoreHook(Param.PitchmodWidth, setParamOscPhase, [0, 1]);
const OscWaveSelectorHook = createStoreHook(Param.PitchmodWidth, setParamOscWaveFunction, [0, 5]);
const OscGainHook = createStoreHook(Param.Gain, setParamOscGain, [0, 1]);

const OscPanel = () => {
  return (
    <Group>
      <HeaderText x={131} y={97} width={38} centered>OSC 1</HeaderText>
      <WavePreviewBox x={131} y={120} />

      <ConnectDial x={127} y={186} h={83} hook={OscWaveSelectorHook}>Wave Selector</ConnectDial>
      <ConnectDial x={193} y={200} h={69} hook={OscPhaseHook}>Phase</ConnectDial>
      <ConnectDial x={259} y={200} h={69} hook={OscGainHook}>Gain</ConnectDial>
    </Group>
  );
};

const DelayWetAmountHook = createStoreHook(Param.DelayWet, setParamDelayWetAmt, [0, 1.1 * 100]);

const DelayPanel = () => {
  return (
    <Group>
      <HeaderText x={355} y={97} width={57} centered>DELAY</HeaderText>

      <ReduxDial x={355} y={123} h={68} store={store} action={setParamDelayLength}>Length</ReduxDial>
      <ConnectDial x={355} y={200} h={68} hook={DelayWetAmountHook}>Dry/Wet</ConnectDial>
    </Group>
  );
};

const ReverbWetAmountHook = createStoreHook(Param.ReverbWet, setParamReverbWetAmt, [0, 1.1 * 100]);

const ReverbPanel = () => {
  return (
    <Group>
      <HeaderText x={355} y={97} width={57} centered>REVERB</HeaderText>

      <ReduxDial x={355} y={123} h={68} store={store} action={setParamDelayLength}>Length</ReduxDial>
      <ConnectDial x={355} y={200} h={68} hook={ReverbWetAmountHook}>Dry/Wet</ConnectDial>
    </Group>
  );
};

export const OscGroupPanel = () => {
  const [enableTouchActive, setTouchActiveEnabled] = useState(true);
  const switchPanels = (checked) => setTouchActiveEnabled(checked);

  return (
    <Group>
      <OscPanel />
      <PanelDivider x={331} y={110} />
      {enableTouchActive ? <ReverbPanel /> : <DelayPanel />}
      <ToggleIcon x={406} y={89} w={28} h={24} checked={enableTouchActive} onClick={switchPanels} />
    </Group>
  );
};