/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number | undefined} a
 */
export function rgbaToHexCode(r, g, b, a) {
  return typeof (a) === 'number' ? `rgba(${r}, ${g}, ${b}, ${a / 255.0})` : `rgb(${r}, ${g}, ${b})`;
}

export function ctOrangeWithOpacity(opacity) {
  return { r: 238, g: 129, b: 12, a: opacity };
}