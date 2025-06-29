import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiResponse, CartResponse } from '~/types';

import { cartApi } from '~/services';

export const cartQueries = createQueryKeys('cart', {
  list: () => ({
    queryKey: ['list'],
    queryFn: async (): Promise<ApiResponse<CartResponse>> => {
      const { data } = await cartApi.getCart();
      return data;
    }
  })
});
