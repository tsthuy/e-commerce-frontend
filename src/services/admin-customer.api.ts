import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants/apis.const';
import { httpBase } from '~/services/config.service';
import type { AdminCustomerListResponse, AdminCustomerPaginationParams, AdminCustomerResponse } from '~/types/admin-customer';
import type { ApiParams, ApiResponse } from '~/types/api';

export const adminCustomerApi = {
  getAllPaged({ data, config }: ApiParams<AdminCustomerPaginationParams>): AxiosPromise<ApiResponse<AdminCustomerListResponse>> {
    return httpBase.get(API_URLS.admin.allCustomers, {
      ...config,
      params: data
    });
  },

  getDetail({ customerId, config }: ApiParams & { customerId: string }): AxiosPromise<ApiResponse<AdminCustomerResponse>> {
    return httpBase.get(API_URLS.admin.customerDetail(customerId), config);
  }
};
