import type { ApiResponse } from '~/types';

export function getApiResult<T>(response: ApiResponse<T>, defaultValue?: T): T | undefined {
  return response.result ?? defaultValue;
}

export function getApiMessage(response: ApiResponse, defaultValue?: string): string {
  return response.result ?? defaultValue;
}
