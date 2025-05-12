import moment from 'moment';

/**
 * Formats a given date string or Date object into a specified format using the moment.js library.
 * This function is useful for converting date values into a human-readable format.
 *
 * @param {string | Date} date - The date to format, which can be a string or a Date object.
 * @param {string} [format='DD/MM/YYYY'] - Optional. The format in which the date should be displayed.
 *                                         Defaults to 'DD/MM/YYYY'.
 *
 * @returns {string} - The formatted date string based on the specified format.
 *
 * Example usage:
 *
 * const formattedDate = formatDate('2024-10-10', 'MMMM Do YYYY');
 * log(formattedDate); // "October 10th 2024"
 *
 * const formattedDateDefault = formatDate(new Date());
 * log(formattedDateDefault); // e.g., "10/10/2024"
 */

export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
  return !!date ? moment(date).local(true).format(format) : '';
}
