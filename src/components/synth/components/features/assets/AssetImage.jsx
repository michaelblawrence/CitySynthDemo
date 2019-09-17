//@ts-check
import React from 'react';
import PropTypes from 'prop-types';
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
export const AssetImage = (props) => {
  const { componentScope, assetName, assetExt, resDirector, onInfoReady, ...others } = props;
  const ext = (typeof assetExt === 'string' && assetExt) || 'png';
  const dir = (typeof resDirector === 'string' && resDirector) || 'synth';

  const [image] = getImage(dir, componentScope, assetName, ext);
  const imageRef = React.useRef();

  /** @type {Image} */
  const imgNode = imageRef.current;

  if (imgNode) {
    // imgNode.rotation(this.imgContainer.rotation() + 90);
  }

  if (image) {
    const imgInfo = getImageInfo(image);
    typeof (onInfoReady) === 'function' && onInfoReady(imgInfo);
  }

  return <Image image={image} ref={imageRef} {...others} />;
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