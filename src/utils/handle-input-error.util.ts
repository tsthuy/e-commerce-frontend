import type { FieldErrors } from 'react-hook-form';

/**
 * Checks if there are input errors associated with a given field name in a form.
 * This function examines the errors object from `react-hook-form` and determines if there is an error
 * related to the specified field name, including support for nested fields and arrays.
 *
 * @param {string} name - The name of the field to check for errors. This can be a simple field name
 *                        or a nested name in the format 'fieldName' or 'fieldName.index.field'.
 * @param {FieldErrors} [errors] - The errors object provided by `react-hook-form`. If not provided,
 *                                  the function assumes there are no errors.
 *
 * @returns {boolean} - Returns true if there is an error associated with the specified field name,
 *                      otherwise false.
 *
 * Example usage:
 *
 * const errors = { user: { name: { message: 'Name is required' } } };
 * const hasNameError = handleInputError('user.name', errors);
 * log(hasNameError); // true
 *
 * const hasEmailError = handleInputError('user.email', errors);
 * log(hasEmailError); // false
 */

export function handleInputError(name: string, errors?: FieldErrors): boolean {
  if (!errors) return false;
  let hasError = false;

  if (errors[name]) {
    hasError = name in errors;
  } else {
    const nameParts = name.split('.');
    if (nameParts.length === 2) {
      const fieldArrayName = nameParts[0];
      const fieldName = nameParts[1];
      const error = errors[fieldArrayName];

      if (error) hasError = Object.keys(error || {}).includes(fieldName);
    } else if (nameParts.length === 3) {
      const fieldArrayName = nameParts[0];
      const fieldIndex = nameParts[1];
      const fieldName = nameParts[2];
      const error = errors[fieldArrayName];

      // @ts-ignore
      if (error) hasError = Object.keys(error[parseInt(fieldIndex)] || {}).includes(fieldName);
    } else {
      // TODO
    }
  }

  return hasError;
}
