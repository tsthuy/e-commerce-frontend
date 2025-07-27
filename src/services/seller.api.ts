import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ApiResponse, SellerProfileResponse, UpdateSellerProfileRequest } from '~/types';

import { httpBase } from '~/services/config.service';

export const sellerApi = {
  getProfile({ config }: ApiParams = {}): AxiosPromise<ApiResponse<SellerProfileResponse>> {
    return httpBase.get<ApiResponse<SellerProfileResponse>>(API_URLS.seller.getProfile, config);
  },

  updateProfile({ data, config }: ApiParams<UpdateSellerProfileRequest>): AxiosPromise<ApiResponse<SellerProfileResponse>> {
    return httpBase.put<UpdateSellerProfileRequest, ApiResponse<SellerProfileResponse>>(API_URLS.seller.updateProfile, data, config);
  },

  getPublicProfile({ sellerId, config }: ApiParams & { sellerId: string }): AxiosPromise<ApiResponse<SellerProfileResponse>> {
    return httpBase.get<ApiResponse<SellerProfileResponse>>(API_URLS.seller.getPublicProfile(sellerId), config);
  }
};
