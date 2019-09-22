//@ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group, Line } from 'react-konva';
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

const txtColour = { r: 255, g: 255, b: 255, a: 150 };

const PresetSelectorBar = ({ onToggleDropDown, presetText }) => {
  return (
    <Group>
      <SelectorBackground onMouseDown={onToggleDropDown} />
      <HeaderText x={10} y={9} fillColour={txtColour}>{presetText}</HeaderText>
      <SelectorUpArrow x={bg_w - sud_w * 2} />
      <SelectorDownArrow x={bg_w - sud_w * 1} />
      <SelectorButton x={bg_w - 1} />
      <SelectorButton x={bg_w - 1 + btn_w} />
    </Group>);
};
PresetSelectorBar.propTypes = {
  onToggleDropDown: PropTypes.func,
  presetText: PropTypes.string,
};

const DropdownMaxRows = 8;

const PresetSelectorDropdown = ({ visible, onChangePreset, selectedIndex: selIdx }) => {
  const [scolledRows, setScolledRows] = useState(0);
  const [selectedIndex, setIndex] = useState(selIdx);
  useEffect(() => {
    setIndex(selIdx);
  }, [selIdx]);

  const items = [
    'preset 1',
    'preset 2',
    'preset 3',
    'preset 4',
    'preset 1',
    'preset 2',
    'preset 3',
    'preset 4',
    'preset 1',
    'preset 2',
    'preset 3',
    'preset 4',
  ];

  const itemTxtColour = (idx) => txtColour;

  const listItemWidth = 242;
  const listItemHeight = 20.4;
  const listItems = items.slice(scolledRows)
    .slice(0, DropdownMaxRows)
    .map((item, idx, {length}) => (
      [
        <HeaderText
          x={13}
          y={38 + listItemHeight * idx}
          fillColour={itemTxtColour(idx)}
          uppercase={false}
          key={item + idx}
        >
          {item}
        </HeaderText>,
        (idx < length - 1) && (<Line
          points={[
            13,
            6.4 + bg_h + listItemHeight * (idx + 1),
            listItemWidth + 25,
            6.4 + bg_h + listItemHeight * (idx + 1)
          ]}
          stroke={'#19191980'}
          strokeWidth={1}
          key={item + idx + 'l'} />)
      ]
    ));

  return visible && (
    <Group>
      <DropDownBackground x={-1} y={bg_h - 1} />
      <DropDownScrollBackground x={bg_w - 6 - scrbg_w} y={bg_h + 5} />
      {listItems}
    </Group>);
};
PresetSelectorDropdown.propTypes = {
  visible: PropTypes.bool,
  onChangePreset: PropTypes.func,
  selectedIndex: PropTypes.number,
};
PresetSelectorDropdown.defaultProps = {
  onChangePreset: null,
  selectedIndex: 0,
};

export const PresetSelector = ({ x, y }) => {
  const [isDropVisible, setDropVisible] = useState(false);
  const toggleDropDown = () => setDropVisible(!isDropVisible);

  const [selectedPreset, setPreset] = useState({ name: 'Initial', idx: 0 });
  const handlePresetName = (presetName, idx) => setPreset({ name: presetName, idx });

  return (
    <Group x={x} y={y}>
      <PresetSelectorBar onToggleDropDown={toggleDropDown} presetText={selectedPreset.name} />
      <PresetSelectorDropdown visible={isDropVisible} onChangePreset={handlePresetName} />
    </Group>
  );
};
PresetSelector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
};

