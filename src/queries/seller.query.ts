import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiParams, ApiResponse, SellerProfileResponse } from '~/types';

import { sellerApi } from '~/services';

export const sellerQueries = createQueryKeys('seller', {
  getProfile: () => ({
    queryKey: [''],
    queryFn: async (): Promise<SellerProfileResponse> => {
      const response = await sellerApi.getProfile({});
      return response.data.result;
    }
  }),

  getPublicProfile: (params: ApiParams & { sellerId: string }) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<SellerProfileResponse>> => {
      const { data } = await sellerApi.getPublicProfile(params);
      return data;
    }
  })
});
