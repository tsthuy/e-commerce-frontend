import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants/apis.const';
import { httpBase } from '~/services/config.service';
import type { AdminSellerListResponse, AdminSellerPaginationParams, AdminSellerResponse } from '~/types/admin-seller';
import type { ApiParams, ApiResponse } from '~/types/api';

export const adminSellerApi = {
  getAllPaged({ data, config }: ApiParams<AdminSellerPaginationParams>): AxiosPromise<ApiResponse<AdminSellerListResponse>> {
    return httpBase.get(API_URLS.admin.allSellers, {
      ...config,
      params: data
    });
  },

  getDetail({ sellerId, config }: ApiParams & { sellerId: string }): AxiosPromise<ApiResponse<AdminSellerResponse>> {
    return httpBase.get(API_URLS.admin.sellerDetail(sellerId), config);
  },

  deleteSeller({ sellerId, config }: ApiParams & { sellerId: string }): AxiosPromise<ApiResponse<void>> {
    return httpBase.delete(API_URLS.admin.deleteSeller(sellerId), config);
  }
};
