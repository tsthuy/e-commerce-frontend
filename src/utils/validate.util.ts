/**
 * Validation rules and error messages for various input fields.
 * Each property contains validation patterns and corresponding error messages for different input types.
 *
 * @constant validates
 */

import { isValidPhoneNumber } from 'libphonenumber-js';

export const validates = {
  required: {
    message: (name: string): string => `${name} is required.`
  },
  phoneNumber: {
    pattern: (value: string): boolean => isValidPhoneNumber(value),
    message: 'Phone number is invalid.'
  },
  email: {
    pattern: /\S+@\S+\.\S+/,
    message: 'Email is invalid.'
  },
  confirmEmail: {
    message: 'Confirm email does not match.'
  },
  password: {
    length: {
      pattern: /^.{8,20}$/,
      message: 'Minimum 8 and maximum 20 characters.'
    },
    uppercase: {
      pattern: /(?=.*[A-Z])/,
      message: 'At least one uppercase character.'
    },
    lowercase: {
      pattern: /(?=.*[a-z])/,
      message: 'At least one lowercase character.'
    },
    digit: {
      pattern: /(?=.*\d)/,
      message: 'At least one digit.'
    },
    special: {
      pattern: /[$&+,:;=?@#|'<>.^*()%!-]/,
      message: 'At least one special character.'
    },
    match: 'Password does not match.'
  },
  notSpace: {
    pattern: /^(?!.*\s)/,
    message: 'This field must not contain spaces.'
  },
  zipCode: {
    pattern: /^[0-9]{5}(?:-[0-9]{4})?$/,
    message: 'Zip code is invalid.'
  },
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Date is invalid.'
  },
  time: {
    pattern: /^\d{2}:\d{2}$/,
    message: 'Time is invalid.'
  },
  commission: {
    pattern: /^0*(?:[1-9][0-9]?|100)$/,
    message: 'Commission must be between 1 and 100.'
  },
  number: {
    pattern: /^[0-9]*$/,
    message: 'Number is invalid.'
  },
  price: {
    pattern: /^\d*\.?\d*$/,
    message: 'Price is invalid.'
  },
  stripe: {
    bsb: {
      au: {
        pattern: /^\d{6}$/,
        message: 'BSB must be 6 characters.'
      }
    },
    accountNumber: {
      au: {
        pattern: /^\d{9}$/,
        message: 'Account number must be 9 characters.'
      }
    }
  }
};
