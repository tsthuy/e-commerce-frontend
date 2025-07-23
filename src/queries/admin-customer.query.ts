import { createQueryKeys } from '@lukemorales/query-key-factory';

import { adminCustomerApi } from '~/services/admin-customer.api';
import type { AdminCustomerListResponse, AdminCustomerPaginationParams, AdminCustomerResponse } from '~/types/admin-customer';
import type { ApiParams, ApiResponse, QueryParams } from '~/types/api';

export const adminCustomerQueries = createQueryKeys('adminCustomer', {
  list: (params: QueryParams<AdminCustomerPaginationParams>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<AdminCustomerListResponse>> => {
      const { data } = await adminCustomerApi.getAllPaged(params);
      return data;
    }
  }),

  detail: (params: ApiParams & { customerId: string }) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<AdminCustomerResponse>> => {
      const { data } = await adminCustomerApi.getDetail(params);
      return data;
    }
  })
});
