//@ts-check
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';
import { clampNumber } from '../../../../../common';
import { SelectorBackground, DropDownScrollBackground, DropDownScrollbarTop, DropDownScrollbarBtm } from './PresetSelector.assets';

const [bg_w, bg_h] = [SelectorBackground.imgWidthPx, SelectorBackground.imgHeightPx];
const scrbg_w = DropDownScrollBackground.imgWidthPx;

export const DropDownScrollbar = ({ scrolledRows, scrolledRowsChanged, itemsCount, slicedCount }) => {
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
DropDownScrollbar.propTypes = {
  scrolledRows: PropTypes.number,
  scrolledRowsChanged: PropTypes.func,
  itemsCount: PropTypes.number,
  slicedCount: PropTypes.number,
};