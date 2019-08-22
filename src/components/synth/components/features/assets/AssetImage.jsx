//@ts-check
import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

/**
 * @param {{
 *  componentScope: string;
 *  assetName: string;
 *  assetExt: string;
 *  resDirector: string;
 *  onInfoReady: (imgInfo: {w: number, h: number}) => void
 * }} props
 */
export function AssetImage(props) {
  const { componentScope, assetName, assetExt, resDirector, onInfoReady, ...others } = props;
  const ext = (typeof assetExt === 'string' && assetExt) || 'png';
  const dir = (typeof resDirector === 'string' && resDirector) || 'synth';

  const [image] = getImage(dir, componentScope, assetName, ext);

  if (image) {
    const imgInfo = getImageInfo(image);
    typeof (onInfoReady) === 'function' && onInfoReady(imgInfo);
  }

  return <Image image={image} {...others} />;
};

/**
 * @param {string} dir
 * @param {string} componentScope
 * @param {string} assetName
 * @param {string} ext
 */
function getImage(dir, componentScope, assetName, ext) {
  return useImage(`${process.env.PUBLIC_URL}/res/${dir}/assets.${componentScope}/${assetName}.${ext}`);
}


/**
 * @param {HTMLImageElement} image
 */
function getImageInfo(image) {
  const w = image.naturalWidth;
  const h = image.naturalHeight;

  return { w, h };
}