import type { AnyType, ErrorResponse } from '~/types';

/**
 * Extracts a meaningful error message from an error object.
 * This function is useful for handling and displaying error messages in a user-friendly manner.
 *
 * @param {AnyType} error - The error object, which can be of any type.
 *                          It is expected to conform to the `ErrorResponse` interface.
 * @param {string} [replaceError] - Optional. A custom error message to return if no message is found in the error object.
 *
 * @returns {string} - The extracted error message. If no message is found, it returns the `replaceError` or an empty string.
 *
 * Example usage:
 *
 * const errorMessage = getErrorMessage(errorResponse);
 * log(errorMessage); // Displays a meaningful error message or a custom one
 */

export function getErrorMessage(error: AnyType, replaceError?: string): string {
  const err = error as ErrorResponse;
  return err?.response?.data?.message || err?.response?.data?.message?.[0] || err?.message || replaceError || '';
}
