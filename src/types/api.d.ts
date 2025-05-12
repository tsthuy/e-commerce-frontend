import type { IFilter } from '@chax-at/prisma-filter-common';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import type { AnyType, BooleanOrNumber, StringOrNull } from './common';

export type ApiParams<T = undefined> = T extends undefined
  ? {
      config?: AxiosRequestConfig;
    }
  : {
      data: T;
      config?: AxiosRequestConfig;
    };
export type QueryParams<T> = {
  data: T;
};
export type UseQueryParams<T = undefined> = T extends undefined
  ? Partial<{
      retry: BooleanOrNumber;
      enabled: boolean;
    }>
  : QueryParams<T> &
      Partial<{
        retry: BooleanOrNumber;
        enabled: boolean;
      }>;
export type UseMutationReturn<T, D> = UseMutationResult<AxiosResponse<T>, Error, QueryParams<D>, unknown>;

export type ListResponse<T> = {
  count: number;
  next: StringOrNull;
  previous: StringOrNull;
  results: Array<T>;
};

export type ListResponseNoPagination<T> = Array<T>;

export type GetParamsNormal = Partial<{}> & { [x: string]: AnyType };

export type GetParamsPrisma = IFilter;

export type ErrorResponse = AxiosError<
  Partial<{
    code: string;
    message: string;
  }>
>;
