import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { SellerProfileResponse } from '~/types';

import { sellerApi } from '~/services';

export const sellerQueries = createQueryKeys('seller', {
  getProfile: () => ({
    queryKey: [''],
    queryFn: async (): Promise<SellerProfileResponse> => {
      const response = await sellerApi.getProfile({});
      return response.data.result;
    }
  })
});
