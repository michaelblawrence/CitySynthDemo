import React, { Component } from 'react';
import { BaseWindow, HeaderText, ToggleIcon, Dial } from './synth';
import { OscGroupPanel, EnvGroupPanel, MasterGroupPanel } from './synth/window-panels';

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

            {/* // more panels // */}
          </BaseWindow>
        </div>
      </section>
    );
  }
}

function CloseWindowButton() {
  return <ToggleIcon x={8} y={6} w={20} h={19} />;
}
