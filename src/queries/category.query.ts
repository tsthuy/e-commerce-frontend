import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiParams, ApiResponse, CategoryListResponse, CategoryPaginationParams, CategoryResponse, QueryParams } from '~/types';

import { categoryApi } from '~/services';

export const categoryQueries = createQueryKeys('category', {
  list: (params: QueryParams<CategoryPaginationParams>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<CategoryListResponse>> => {
      const { data } = await categoryApi.getAllPaged(params);
      return data;
    }
  }),
  detail: (params: ApiParams & { categoryId: string }) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<CategoryResponse>> => {
      const { data } = await categoryApi.detail(params);
      return data;
    }
  })
});
