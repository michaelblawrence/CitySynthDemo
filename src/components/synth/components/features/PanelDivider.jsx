import React from 'react';
import { AssetImage } from './assets';

export function PanelDivider(props) {
    const { ...other } = props;
    return <AssetImage componentScope={'PanelDivider'} assetName={'pnl-div-vline'} {...other} />
  }