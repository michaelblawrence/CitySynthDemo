// @ts-check

/**
 * @param {number} value
 * @param {number} max
 * @param {number} min
 */
export function clampNumber(value, max, min) {
  return Math.min(Math.max(value, min || 0), max || 1);
}