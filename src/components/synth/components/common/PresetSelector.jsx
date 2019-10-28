//@ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AssetImage } from '../features';
import { Group, Line, Rect } from 'react-konva';
import { HeaderText } from './HeaderText';
import { postPresetLine } from '../../../../workerActions';
import { clampNumber } from '../../../../common';

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

const DropDownScrollbarTop = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-bar-fg-top'} {...props} />;
};
DropDownScrollbarTop.imgHeightPx = 12;

const DropDownScrollbarMid = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-bar-fg-mid'} {...props} />;
};
DropDownScrollbarMid.imgHeightPx = 15;

const DropDownScrollbarBtm = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-bar-fg-btm'} {...props} />;
};
DropDownScrollbarBtm.imgHeightPx = 15;

const [bg_w, bg_h] = [SelectorBackground.imgWidthPx, SelectorBackground.imgHeightPx];
const sud_w = SelectorDownArrow.imgWidthPx;
const btn_w = SelectorButton.imgWidthPx;
const scrbg_w = DropDownScrollBackground.imgWidthPx;

const txtColour = { r: 255, g: 255, b: 255, a: 150 };
const txtSelectedColour = { r: 255, g: 255, b: 255, a: 255 };

const PresetEventType = {
  UP_BUTTON_PRESSED: 'UP_BUTTON_PRESSED',
  DOWN_BUTTON_PRESSED: 'DOWN_BUTTON_PRESSED',
  RELOAD_PRESET: 'RELOAD_PRESET'
};

const PresetSelectorBar = ({ onToggleDropDown, presetText, handleEvent }) => {
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

const DropdownMaxRows = 8;

const PresetSelectorDropdown = ({ visible, onChangePreset, handleEvent, presetItems, selectedIndex: selIdx }) => {
  const [scrolledRows, setScrolledRows] = useState(0);
  const [selectedIndex, setIndex] = useState(selIdx);

  const scrollIdx = {
    min: scrolledRows,
    max: scrolledRows + DropdownMaxRows
  };

  useEffect(() => {
    if (selIdx !== selectedIndex) {
      if (selIdx < scrollIdx.min && selIdx >= 0) {
        setScrolledRows(selIdx);
      } else if (selIdx >= scrollIdx.max) {
        setScrolledRows(Math.min(selIdx - DropdownMaxRows + 1, presetItems.length - DropdownMaxRows));
      }
    }
    setIndex(selIdx);
  }, [selIdx]);

  const onScroll = nextScrolledRows => {
    if (nextScrolledRows !== scrolledRows) {
      setScrolledRows(nextScrolledRows);
    }
  };

  const itemTxtColour = (idx) => idx === selectedIndex ? txtSelectedColour : txtColour;

  const listItemWidth = 242;
  const listItemHeight = 20.4;
  const listItems = presetItems
    .slice(scrollIdx.min, scrollIdx.max)
    .map((item, idx, { length }) => {
      const handlePresetClick = () => {
        onChangePreset({
          idx: scrolledRows + idx,
          presetName: presetItems[scrolledRows + idx]
        });
        handleEvent(PresetEventType.RELOAD_PRESET);
      };

      return [
        <HeaderText
          x={13}
          y={38 + listItemHeight * idx}
          fillColour={itemTxtColour(scrolledRows + idx)}
          uppercase={false}
          key={item + idx + '_0'}
        >
          {item}
        </HeaderText>,
        (idx < length - 1) && (<Line
          points={[
            13,
            6.4 + bg_h + listItemHeight * (idx + 1),
            listItemWidth + 13,
            6.4 + bg_h + listItemHeight * (idx + 1)
          ]}
          stroke={'#19191980'}
          strokeWidth={1}
          key={item + idx + '_l'} />),
        <Rect
          x={13}
          y={38 + listItemHeight * idx}
          width={listItemWidth}
          height={listItemHeight}
          fillColour={{ r: 0, g: 0, b: 0, a: 0 }}
          onClick={handlePresetClick}
          key={item + idx + '_2'}
        />
      ];
    });

  const scrollOffsetX = bg_w - 6 - scrbg_w;
  const scrollOffsetY = bg_h + 5;

  return visible && (
    <Group>
      <DropDownBackground x={-1} y={bg_h - 1} />
      {listItems}
      <DropDownScrollBackground x={scrollOffsetX} y={scrollOffsetY} />
      <DropDownScrollbar scrolledRows={scrolledRows} scrolledRowsChanged={onScroll} itemsCount={presetItems.length} slicedCount={listItems.length} />
    </Group>);
};

const DropDownScrollbar = ({ scrolledRows, scrolledRowsChanged, itemsCount, slicedCount }) => {
  const scrollOffsetX = bg_w - 6 - scrbg_w;
  const scrollOffsetY = bg_h + 5;
  const dropScrollTopH = DropDownScrollbarTop.imgHeightPx;

  const scrollAmtMax = 140;
  const scrollAmtCalc = _scrolledRows => Math.floor(scrollAmtMax * _scrolledRows / (itemsCount - slicedCount));
  const scrollRowsCalc = y => Math.round(clampNumber(y, scrollAmtMax, 0) * (itemsCount - slicedCount) / scrollAmtMax);
  const [scrollAmt, setScrollAmt] = useState(scrollAmtCalc(scrolledRows));

  useEffect(() => {
    setScrollAmt(scrollAmtCalc(scrolledRows));
  }, [scrolledRows]);

  /**
   * @param {import('konva/types/Node').KonvaEventObject<DragEvent>} evt
   */
  const onDragMove = evt => {
    const targetY = evt.target.y();

    evt.target.x(0);
    evt.target.y(clampNumber(targetY, scrollAmtMax, 0));
    
    const calcScrollRows = scrollRowsCalc(targetY);
    if (calcScrollRows !== scrolledRows) {
      scrolledRowsChanged(calcScrollRows);
    }
  };

  /**
   * @param {import('konva/types/Node').KonvaEventObject<DragEvent>} evt
   */
  const onDragEnd = evt => {
    const calcScrollRows = scrollRowsCalc(evt.target.y());
    setScrollAmt(scrollAmtCalc(calcScrollRows));
  };

  return (
    <Group y={scrollAmt} draggable={true} onDragMove={onDragMove} onDragEnd={onDragEnd}>
      <DropDownScrollbarTop x={scrollOffsetX} y={scrollOffsetY} />
      {/* <DropDownScrollbarMid x={scrollOffsetX} y={scrollOffsetY + scrollAmt + dropScrollTopH} /> */}
      <DropDownScrollbarBtm x={scrollOffsetX} y={scrollOffsetY + dropScrollTopH} />
    </Group>
  );
};
PresetSelectorDropdown.propTypes = {
  visible: PropTypes.bool,
  onChangePreset: PropTypes.func,
  handleEvent: PropTypes.func,
  selectedIndex: PropTypes.number,
};
PresetSelectorDropdown.defaultProps = {
  onChangePreset: null,
  selectedIndex: 0,
};

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
  const initialPresetIdx = 0;

  const [selectedPreset, setPreset] = useState({ presetName: 'Initial', idx: 0 });
  const handlePresetName = ({ presetName, idx }) => setPreset({ presetName, idx });

  useEffect(() => {
    tempPresetsPromise
      .then(res => res.text())
      .then(text => {
        const presetArray = parsePresetLines(text);
        const initialPresetName = parsePresetName(presetArray, initialPresetIdx);
        updatePresetArray(presetArray);
        handlePresetName({ presetName: initialPresetName, idx: initialPresetIdx });
        // handleEvent(PresetEventType.RELOAD_PRESET);
      });
  }, []);



  const shiftPreset = (shiftAmount) => {
    const presetCount = presetArray.length;
    const idx = (selectedPreset.idx + shiftAmount + presetCount) % presetCount;
    return { presetName: parsePresetName(presetArray, idx), idx };
  };

  /**
   * @param {string} [presetEventType]
   */
  const handleEvent = presetEventType => {
    let newPreset = selectedPreset;
    switch (presetEventType) {
      case PresetEventType.UP_BUTTON_PRESSED:
        newPreset = shiftPreset(-1);
        setPreset(newPreset);
        postPresetLine(presetArray[newPreset.idx]);
        break;
      case PresetEventType.DOWN_BUTTON_PRESSED:
        newPreset = shiftPreset(+1);
        setPreset(newPreset);
        postPresetLine(presetArray[newPreset.idx]);
        break;
      case PresetEventType.RELOAD_PRESET:
        // newPreset = shiftPreset(0);
        // setPreset(newPreset);
        postPresetLine(presetArray[selectedPreset.idx]);
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
        onChangePreset={handlePresetName}
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

