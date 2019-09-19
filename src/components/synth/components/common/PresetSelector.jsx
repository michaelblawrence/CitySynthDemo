//@ts-check
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group } from 'react-konva';
import { HeaderText } from './HeaderText';

const SelectorBackground = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'base-sel-bar-bg'} {...props} />;
};
SelectorBackground.imgWidthPx = 279;
SelectorBackground.imgHeightPx = 27;

const SelectorButton = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'btn-sel-bar-bg'} {...props} />;
};
SelectorButton.imgWidthPx = 26;

const SelectorUpArrow = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'arrow-up-sel'} {...props} />;
};

const SelectorDownArrow = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'arrow-down-sel'} {...props} />;
};
SelectorDownArrow.imgWidthPx = 27;

const DropDownBackground = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'base-drop-down-bg'} {...props} />;
};
DropDownBackground.imgWidthPx = 278;
DropDownBackground.imgHeightPx = 165;

const DropDownScrollBackground = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-drop-down-bg'} {...props} />;
};
DropDownScrollBackground.imgWidthPx = 13;

const [bg_w, bg_h] = [SelectorBackground.imgWidthPx, SelectorBackground.imgHeightPx];
const sud_w = SelectorDownArrow.imgWidthPx;
const btn_w = SelectorButton.imgWidthPx;
const scrbg_w = DropDownScrollBackground.imgWidthPx;

const PresetSelectorBar = ({ onToggleDropDown }) => {
  const txtColour = { r: 255, g: 255, b: 255, a: 150 };
  return (
    <Group>
      <SelectorBackground onMouseDown={onToggleDropDown} />
      <HeaderText x={10} y={9} fillColour={txtColour}>Hello World</HeaderText>
      <SelectorUpArrow x={bg_w - sud_w * 2} />
      <SelectorDownArrow x={bg_w - sud_w * 1} />
      <SelectorButton x={bg_w - 1} />
      <SelectorButton x={bg_w - 1 + btn_w} />
    </Group>);
};
PresetSelectorBar.propTypes = {
  onToggleDropDown: PropTypes.func,
};

const PresetSelectorDropdown = ({ visible }) => {
  return visible && (<Group>
    <DropDownBackground x={-1} y={bg_h - 1} />
    <DropDownScrollBackground x={bg_w - 6 - scrbg_w} y={bg_h + 5} />
  </Group>);
};
PresetSelectorDropdown.propTypes = {
  visible: PropTypes.bool,
};

export const PresetSelector = ({ x, y }) => {
  const [isDropVisible, setDropVisible] = useState(false);
  const toggleDropDown = () => setDropVisible(!isDropVisible);

  return (
    <Group x={x} y={y}>
      <PresetSelectorBar onToggleDropDown={toggleDropDown} />
      <PresetSelectorDropdown visible={isDropVisible} />
    </Group>
  );
};
PresetSelector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
};

