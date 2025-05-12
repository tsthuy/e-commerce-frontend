/**
 * Generates an array representing pagination controls.
 * This function calculates which page numbers to display based on the current page and the total number of pages.
 * It includes ellipsis (`null`) to indicate gaps in the pagination sequence.
 *
 * @param {number} c - The current page number (1-based index).
 * @param {number} m - The total number of pages available.
 *
 * @returns {Array<number | null>} - An array of page numbers and `null` values representing ellipsis for skipped pages.
 *                                    The array includes the first and last pages, the current page, and surrounding pages.
 *
 * Example usage:
 *
 * const pagination = renderPagination(3, 10);
 * log(pagination); // [1, 2, 3, 4, null, 10]
 *
 * const paginationEdge = renderPagination(1, 5);
 * log(paginationEdge); // [1, 2, 3, null, 5]
 */

export function renderPagination(c: number, m: number): Array<number | null> {
  const current = c;
  const last = m;
  const delta = 1;
  const left = current - delta;
  const right = current + delta + 1;
  const range: Array<number> = [];
  const rangeWithDots: Array<number | null> = [];
  let l;

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) range.push(i);
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push(null);
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}
