// @ts-check

/**
 * @param {number} value
 * @param {number} max
 * @param {number} min
 */
export function clampNumber(value, max = 1, min = 0) {
  return Math.min(Math.max(value, min), max);
}