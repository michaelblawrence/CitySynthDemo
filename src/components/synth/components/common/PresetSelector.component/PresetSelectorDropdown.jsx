//@ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Group, Line, Rect } from 'react-konva';
import { HeaderText } from '../HeaderText';
import { SelectorBackground, DropDownScrollBackground, DropDownBackground, PresetEventType } from './PresetSelector.assets';
import { DropDownScrollbar } from './DropDownScrollbar';

const [bg_w, bg_h] = [SelectorBackground.imgWidthPx, SelectorBackground.imgHeightPx];
const scrbg_w = DropDownScrollBackground.imgWidthPx;

const txtColour = { r: 255, g: 255, b: 255, a: 150 };
const txtSelectedColour = { r: 255, g: 255, b: 255, a: 255 };

const DropdownMaxRows = 8;

export const PresetSelectorDropdown = ({ visible, onChangePreset, handleEvent, presetItems, selectedIndex: selIdx }) => {
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
        onChangePreset && onChangePreset({
          idx: scrolledRows + idx,
          presetName: presetItems[scrolledRows + idx]
        });
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