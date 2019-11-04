//@ts-check
import React, {  } from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';
import { HeaderText } from '../HeaderText';
import { SelectorBackground, SelectorDownArrow, SelectorButton, SelectorUpArrow } from './PresetSelector.assets';

const [bg_w] = [SelectorBackground.imgWidthPx];
const sud_w = SelectorDownArrow.imgWidthPx;
const btn_w = SelectorButton.imgWidthPx;

const txtColour = { r: 255, g: 255, b: 255, a: 150 };

const PresetEventType = {
  UP_BUTTON_PRESSED: 'UP_BUTTON_PRESSED',
  DOWN_BUTTON_PRESSED: 'DOWN_BUTTON_PRESSED',
  RELOAD_PRESET: 'RELOAD_PRESET'
};

export const PresetSelectorBar = ({ onToggleDropDown, presetText, handleEvent }) => {
  const onUpButtonClick = () => handleEvent(PresetEventType.UP_BUTTON_PRESSED);
  const onDownButtonClick = () => handleEvent(PresetEventType.DOWN_BUTTON_PRESSED);
  return (
    <Group>
      <SelectorBackground onMouseDown={onToggleDropDown} />
      <HeaderText x={10} y={9} fillColour={txtColour}>{presetText}</HeaderText>
      <SelectorUpArrow x={bg_w - sud_w * 2} onClick={onUpButtonClick} />
      <SelectorDownArrow x={bg_w - sud_w * 1} onClick={onDownButtonClick} />
      <SelectorButton x={bg_w - 1} />
      <SelectorButton x={bg_w - 1 + btn_w} />
    </Group>);
};
PresetSelectorBar.propTypes = {
  onToggleDropDown: PropTypes.func,
  handleEvent: PropTypes.func,
  presetText: PropTypes.string,
};