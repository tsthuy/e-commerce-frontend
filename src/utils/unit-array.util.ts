/**
 * Removes duplicate values from an array while preserving the order of elements.
 * This function takes an array of values (which can be strings, numbers, booleans, null, or undefined)
 * and returns a new array containing only unique values.
 *
 * @param {Array<string | number | boolean | null | undefined>} arr - The input array containing values to be deduplicated.
 *
 * @returns {Array<string | number | boolean | null | undefined>} - A new array with duplicates removed, preserving the original order of the first occurrences.
 *
 * Example usage:
 *
 * const inputArray = [1, 2, 2, 3, 'a', 'a', null, undefined, true, true];
 * const uniqueArray = unitArray(inputArray);
 * log(uniqueArray); // [1, 2, 3, 'a', null, undefined, true]
 */

export function unitArray(arr: Array<string | number | boolean | null | undefined>): Array<string | number | boolean | null | undefined> {
  // @ts-ignore
  return [...new Set(arr)];
}
