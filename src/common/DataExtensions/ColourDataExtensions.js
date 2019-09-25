/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number | undefined} a
 */
export function rgbaToHexCode(r, g, b, a) {
  return typeof (a) === 'number' ? `rgba(${r}, ${g}, ${b}, ${a / 255.0})` : `rgb(${r}, ${g}, ${b})`;
}
// /**
//  * @param {number} r
//  * @param {number} g
//  * @param {number} b
//  * @param {number | undefined} a
//  */
// export function rgbaToFormattedHexCode(r, g, b, a) {
//   return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${typeof (a) === 'number' ? a.toString(16) : ''}`;
// }

export function ctOrangeWithOpacity(opacity) {
  return { r: 238, g: 129, b: 12, a: opacity };
}