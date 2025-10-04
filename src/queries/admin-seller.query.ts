import { createQueryKeys } from '@lukemorales/query-key-factory';

import { adminSellerApi } from '~/services/admin-seller.api';
import type { AdminSellerListResponse, AdminSellerPaginationParams, AdminSellerResponse } from '~/types/admin-seller';
import type { ApiParams, ApiResponse, QueryParams } from '~/types/api';

export const adminSellerQueries = createQueryKeys('adminSeller', {
  list: (params: QueryParams<AdminSellerPaginationParams>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<AdminSellerListResponse>> => {
      const { data } = await adminSellerApi.getAllPaged(params);
      return data;
    }
  }),

  detail: (params: ApiParams & { sellerId: string }) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<AdminSellerResponse>> => {
      const { data } = await adminSellerApi.getDetail(params);
      return data;
    }
  })
});
