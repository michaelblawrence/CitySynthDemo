// @ts-check

/**
 * @param {{[key: string]: any}} obj
 */
export function classNames(obj) {
  return Object.entries(obj).filter(e => e[1]).map(e => e[0]).join(' ');
}