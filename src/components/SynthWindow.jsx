import React, { Component } from 'react';
import { BaseWindow, ToggleIcon } from './synth';
import { OscGroupPanel, EnvGroupPanel, MasterGroupPanel, PitchGroupPanel, FilterTouchGroupPanel, AmpEnvGroupPanel } from './synth/window-panels';

export class SynthWindow extends Component {
  render() {
    return (
      <section id="about">
        <div className="row">
          <BaseWindow>
            <CloseWindowButton />
            <OscGroupPanel />
            <EnvGroupPanel />
            <MasterGroupPanel />

            <PitchGroupPanel />
            <AmpEnvGroupPanel />
            <FilterTouchGroupPanel />
          </BaseWindow>
        </div>
      </section>
    );
  }
}

function CloseWindowButton() {
  return <ToggleIcon x={8} y={4} w={20} h={19} />;
}
