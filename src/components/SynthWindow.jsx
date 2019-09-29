import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BaseWindow, ToggleIcon, PresetSelector } from './synth';
import { OscGroupPanel, EnvGroupPanel, MasterGroupPanel, PitchGroupPanel, FilterTouchGroupPanel, AmpEnvGroupPanel } from './synth/window-panels';
import { getWasmModule } from '../workerActions';
import { Group } from 'react-konva';
import { classNames } from '../common';

export const SynthWindow = () => {
  const [showOverlay, setOverlayVisible] = useState(true);
  const [showLoading, setIsLoading] = useState(false);

  const hideOverlay = () => {
    setIsLoading(true);
    getWasmModule().then(() => {
      setOverlayVisible(false);
      setIsLoading(false);
    });
  };

  return (
    <section id="demo">
      <div className="row">
        <h2 className="feature-header">Try the Live Beta in your browser!</h2>
      </div>
      <div className={classNames({'row': true, 'row--synth': true, 'blur-animation': showLoading})}>
        <BaseWindow>
          <OscGroupPanel />
          <EnvGroupPanel />
          <MasterGroupPanel />

          <PitchGroupPanel />
          <AmpEnvGroupPanel />
          <FilterTouchGroupPanel />

          <WindowCaptionArea />
        </BaseWindow>
        {showOverlay &&
          <InitialWindowOverlay hideOverlay={hideOverlay} isLoading={showLoading} />
        }
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

const InitialWindowOverlay = ({ hideOverlay, isLoading }) => {
  return (
    <div className='overlay' style={{ width: 925, height: 528 }} onClick={hideOverlay}>
      {!isLoading &&
        <i className="fa fa-play"></i>
      }
    </div>
  );
};
InitialWindowOverlay.propTypes = {
  hideOverlay: PropTypes.func,
  isLoading: PropTypes.bool
};