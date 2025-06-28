import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse, CategoryListResponse, CategoryPaginationParams, CategoryResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

export function useCategoryList({ data, enabled = true, retry = false }: UseQueryParams<CategoryPaginationParams>): UseQueryResult<ApiResponse<CategoryListResponse>> {
  const queryResponse = useQuery({
    ...queries.category.list({ data }),
    retry,
    enabled
  });
  return queryResponse;
}
export function useCategoryDetail({ categoryId, retry = false, enabled = true }: UseQueryParams & { categoryId: string }): UseQueryResult<ApiResponse<CategoryResponse>> {
  const queryResponse = useQuery({
    ...queries.category.detail({ categoryId }),
    retry,
    enabled
  });
  return queryResponse;
}
