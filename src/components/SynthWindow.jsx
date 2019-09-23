import React from 'react';
import { BaseWindow, ToggleIcon, PresetSelector } from './synth';
import { OscGroupPanel, EnvGroupPanel, MasterGroupPanel, PitchGroupPanel, FilterTouchGroupPanel, AmpEnvGroupPanel } from './synth/window-panels';
import { getWasmModule } from '../workerActions';
import { Group } from 'react-konva';

export const SynthWindow = () => {
  return (
    <section id="demo">
      <div className="row">
        <BaseWindow>
          <OscGroupPanel />
          <EnvGroupPanel />
          <MasterGroupPanel />

          <PitchGroupPanel />
          <AmpEnvGroupPanel />
          <FilterTouchGroupPanel />

          <WindowCaptionArea />
        </BaseWindow>
      </div>
    </section>
  );
};

const CloseWindowButton = () => {
  const handleClick = () => {
    getWasmModule();
  };
  return <ToggleIcon x={8} y={4} w={20} h={19} onClick={handleClick} />;
};

const WindowCaptionArea = () => {
  return (
    <Group>
      <CloseWindowButton />
      <PresetSelector x={367} y={33} />
    </Group>
  );
};
