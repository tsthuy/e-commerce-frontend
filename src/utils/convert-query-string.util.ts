// @ts-nocheck

/**
 * Converts either normal parameters or Prisma parameters into a query string.
 * This function is useful for generating query strings for HTTP requests based on different parameter types.
 *
 * @typedef {Object} ConvertNormalParams
 * @property {string | number | boolean | undefined | null | { field: string; value: string }} [x: string]
 * - The normal parameters where keys are string identifiers and values can be string, number, boolean, or null/undefined.
 * - Special handling for the `sort` key, which should have a `field` and `value`.
 *
 * @typedef {Object} ConvertQueryStringParams
 * @property {'normal' | 'prisma'} type - Specifies the type of parameters being passed: either 'normal' or 'prisma'.
 * @property {ConvertNormalParams | GetParamsPrisma} params - The input parameters to convert to a query string.
 * - For 'normal', these are general query parameters.
 * - For 'prisma', these are Prisma-specific parameters to build the query string.
 *
 * @param {ConvertQueryStringParams} { type, params } - The type of parameters and the parameters themselves to be converted.
 *
 * @returns {string} - A query string formatted according to either normal or Prisma parameters.
 *
 * Example usage:
 *
 * const normalParams = { id: 1, name: 'John', active: true, sort: { field: 'name', value: 'asc' } };
 * const queryString = convertQueryString({ type: 'normal', params: normalParams });
 * log(queryString); // "?id=1&name=John&active=true&sort[name]=asc"
 *
 * const prismaParams = { where: { name: 'John' }, orderBy: { name: 'asc' } };
 * const prismaQueryString = convertQueryString({ type: 'prisma', params: prismaParams });
 * log(prismaQueryString); // Prisma-specific query string
 */

import { FilterBuilder } from '@chax-at/prisma-filter-common/lib/filter.builder';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

import type { GetParamsNormal, GetParamsPrisma } from '~/types';

type ConvertQueryStringParams =
  | {
      params: GetParamsNormal;
      type: 'normal';
    }
  | {
      params: GetParamsPrisma;
      type: 'prisma';
    };

/**
 * Converts normal parameters into a query string.
 * Handles sorting fields through the `sort` key, which must contain `field` and `value`.
 *
 * @param {ConvertNormalParams} params - The normal parameters.
 * @returns {string} - The generated query string.
 */
function convertNormal(params: ConvertNormalParams): string {
  let result = '?';

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      if (key === 'sort' && isObject(params[key]) && !Array.isArray(params[key])) {
        if (!params[key].field || !params[key].value) return;

        result += `sort[${params[key].field}]=${params[key].value}&`;
      }

      if (typeof params[key] === 'boolean' || params[key]) {
        result += `${key}=${params[key]}&`;
      }
    }
  });

  if (result.endsWith('&') || result.endsWith('?')) {
    result = result.slice(0, result.length - 1);
  }

  return result;
}

/**
 * Converts Prisma parameters into a query string using the Prisma FilterBuilder.
 *
 * @param {GetParamsPrisma} params - The Prisma parameters.
 * @returns {string} - The generated Prisma query string.
 */
function convertPrisma(params: GetParamsPrisma): string {
  return FilterBuilder.buildFilterQueryString(params);
}

/**
 * Converts the provided parameters to a query string based on the type.
 * - For 'normal' type, it converts normal parameters.
 * - For 'prisma' type, it converts Prisma parameters.
 * Returns an empty string if the input parameters are empty.
 *
 * @param {ConvertQueryStringParams} { type, params } - The type of parameters and the parameters to be converted.
 * @returns {string} - The generated query string or an empty string if parameters are empty.
 */
export function convertQueryString({ type, params }: ConvertQueryStringParams): string {
  return type === 'normal' && !isEmpty(params) ? convertNormal(params) : type === 'prisma' && !isEmpty(params) ? convertPrisma(params) : '';
}
