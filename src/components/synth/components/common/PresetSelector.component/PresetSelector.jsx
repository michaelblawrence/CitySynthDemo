//@ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';
import { postPresetLine, synthReady$ } from '../../../../../workerActions';
import { PresetEventType } from './PresetSelector.assets';
import { PresetSelectorBar } from './PresetSelectorBar';
import { PresetSelectorDropdown } from './PresetSelectorDropdown';
import { take } from 'rxjs/operators';

const tempPresetsPromise = fetch('res/csharp/factorypresets.sdp');

/**
 * @param {string} presets
 */
const parsePresetLines = (presets) => {
  return (presets && presets.split('\n')) || [];
};

/**
 * @param {string[]} presetArray
 * @param {number} index
 */
const parsePresetName = (presetArray, index) => {
  const presetLine = presetArray && presetArray[index];
  return parsePresetNameFromLine(presetLine);
};
/**
 * @param {string} presetLine
 */
const parsePresetNameFromLine = (presetLine) => {
  const presetSections = presetLine && presetLine.split('|');
  const metadata = (presetSections && presetSections.length > 1 && presetSections[0]) || null;
  const metadataSections = metadata && metadata.split(':');
  return metadataSections && metadataSections[1];
};

export const PresetSelector = ({ x, y }) => {
  const [isDropVisible, setDropVisible] = useState(false);
  const toggleDropDown = () => setDropVisible(!isDropVisible);

  const [presetArray, updatePresetArray] = useState([]);
  const [synthReady, updateSynthReady] = useState(false);
  const initialPresetIdx = 0;

  const [selectedPreset, setPreset] = useState({ presetName: 'Initial', idx: 0 });
  const handlePresetNameAndPush = async ({ presetName, idx }) =>
    await new Promise(ok => setPreset(() => { ok(); return { presetName, idx }; }));

  useEffect(() => {
    tempPresetsPromise
      .then(res => res.text())
      .then(text => {
        const presetArray = parsePresetLines(text);
        const initialPresetName = parsePresetName(presetArray, initialPresetIdx);
        updatePresetArray(presetArray);
        return handlePresetNameAndPush({ presetName: initialPresetName, idx: initialPresetIdx });
      });
    synthReady$.pipe(
      take(1)
    ).subscribe(() => {
      updateSynthReady(true);
    });
  }, []);
  useEffect(() => {
    if (synthReady === true && presetArray.length > 0) {
      handleEvent(PresetEventType.RELOAD_PRESET);
      updateSynthReady(null);
    }
  }, [presetArray, synthReady]);

  const handleNewPresetSelection = async ({ presetName, idx }) => {
    await handlePresetNameAndPush({presetName, idx});
    await postPresetLine(presetArray[idx]);
  };

  const shiftPreset = (shiftAmount) => {
    const presetCount = presetArray.length;
    const idx = ((selectedPreset.idx + shiftAmount + presetCount) % presetCount) || 0;
    return { presetName: parsePresetName(presetArray, idx), idx };
  };

  /**
   * @param {string} [presetEventType]
   */
  const handleEvent = async (presetEventType) => {
    let newPreset = selectedPreset;
    switch (presetEventType) {
      case PresetEventType.UP_BUTTON_PRESSED:
        newPreset = shiftPreset(-1);
        setPreset(newPreset);
        await postPresetLine(presetArray[newPreset.idx]);
        break;
      case PresetEventType.DOWN_BUTTON_PRESSED:
        newPreset = shiftPreset(+1);
        setPreset(newPreset);
        await postPresetLine(presetArray[newPreset.idx]);
        break;
      case PresetEventType.RELOAD_PRESET:
        newPreset = shiftPreset(0);
        setPreset(newPreset);
        await postPresetLine(presetArray[newPreset.idx]);
        break;
      default:
        break;
    }
  };

  return (
    <Group x={x} y={y}>
      <PresetSelectorBar
        onToggleDropDown={toggleDropDown}
        presetText={selectedPreset.presetName}
        handleEvent={handleEvent}
      />
      <PresetSelectorDropdown
        visible={isDropVisible}
        onChangePreset={handleNewPresetSelection}
        selectedIndex={selectedPreset.idx}
        handleEvent={handleEvent}
        presetItems={presetArray.map(line => parsePresetNameFromLine(line))}
      />
    </Group>
  );
};
PresetSelector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
};

