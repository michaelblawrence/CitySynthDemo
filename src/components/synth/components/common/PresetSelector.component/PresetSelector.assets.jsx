//@ts-check
import React from 'react';
import { AssetImage } from '../../features';

export const SelectorBackground = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'base-sel-bar-bg'} {...props} />;
};
SelectorBackground.imgWidthPx = 279;
SelectorBackground.imgHeightPx = 27;

export const SelectorButton = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'btn-sel-bar-bg'} {...props} />;
};
SelectorButton.imgWidthPx = 26;

export const SelectorUpArrow = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'arrow-up-sel'} {...props} />;
};

export const SelectorDownArrow = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'arrow-down-sel'} {...props} />;
};
SelectorDownArrow.imgWidthPx = 27;

export const DropDownBackground = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'base-drop-down-bg'} {...props} />;
};
DropDownBackground.imgWidthPx = 278;
DropDownBackground.imgHeightPx = 165;

export const DropDownScrollBackground = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-drop-down-bg'} {...props} />;
};
DropDownScrollBackground.imgWidthPx = 13;

export const DropDownScrollbarTop = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-bar-fg-top'} {...props} />;
};
DropDownScrollbarTop.imgHeightPx = 12;

export const DropDownScrollbarMid = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-bar-fg-mid'} {...props} />;
};
DropDownScrollbarMid.imgHeightPx = 15;

export const DropDownScrollbarBtm = (props) => {
  return <AssetImage componentScope={'PresetSelector'} assetName={'scroll-bar-fg-btm'} {...props} />;
};
DropDownScrollbarBtm.imgHeightPx = 15;

export const PresetEventType = {
  UP_BUTTON_PRESSED: 'UP_BUTTON_PRESSED',
  DOWN_BUTTON_PRESSED: 'DOWN_BUTTON_PRESSED',
  RELOAD_PRESET: 'RELOAD_PRESET'
};