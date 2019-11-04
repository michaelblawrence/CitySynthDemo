//@ts-check
import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-konva';
import useImage from 'use-image';

const elementCache = {};

const getCacheKey = ({ dir, componentScope, assetName, ext }) =>
  dir + '|' + componentScope + '|' + assetName + '|' + ext;

const getImageFromSrc = ({ dir, componentScope, assetName, ext }, performNoOp) =>
  getImage(dir, componentScope, assetName, ext, performNoOp);

/**
 * @param {{
 *  componentScope: string;
 *  assetName: string;
 *  assetExt: string;
 *  resDirector: string;
 *  onInfoReady: (imgInfo: {w: number, h: number}) => void
 * }} props
 */
export const AssetImage = (props) => {
  const { componentScope, assetName, assetExt, resDirector, onInfoReady, ...others } = props;
  const ext = (typeof assetExt === 'string' && assetExt) || 'png';
  const dir = (typeof resDirector === 'string' && resDirector) || 'synth';

  const assetPath = { dir, componentScope, assetName, ext };

  const cacheKey = getCacheKey(assetPath);
  const cached = elementCache[cacheKey];

  const performNoOpNetworkAction = typeof cached !== 'undefined';
  const image = (getImageFromSrc(assetPath, performNoOpNetworkAction) || [])[0] || cached;

  if (!performNoOpNetworkAction && image) {
    elementCache[cacheKey] = image;
  }

  if (image) {
    const imgInfo = getImageInfo(image);
    typeof (onInfoReady) === 'function' && onInfoReady(imgInfo);
  }

  return <Image image={image} {...others} />;
};

AssetImage.propTypes = {
  componentScope: PropTypes.string,
  assetName: PropTypes.string,
  assetExt: PropTypes.string,
  resDirector: PropTypes.string,
  onInfoReady: PropTypes.func
};

/**
 * @param {string} dir
 * @param {string} componentScope
 * @param {string} assetName
 * @param {string} ext
 */
function getImage(dir, componentScope, assetName, ext, performNoOp) {
  // eslint-disable-next-line no-undef
  const url = `${process.env.PUBLIC_URL}/res/${dir}/assets.${componentScope}/${assetName}.${ext}`;
  return useImage(performNoOp ? null : url);
}


/**
 * @param {HTMLImageElement} image
 */
function getImageInfo(image) {
  const w = image.naturalWidth;
  const h = image.naturalHeight;

  return { w, h };
}