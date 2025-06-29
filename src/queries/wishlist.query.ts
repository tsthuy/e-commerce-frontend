import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiResponse } from '~/types';

import { wishlistApi } from '~/services';

import type { WishlistResponse } from '~/types/wishlist';

export const wishlistQueries = createQueryKeys('wishlist', {
  list: () => ({
    queryKey: ['list'],
    queryFn: async (): Promise<ApiResponse<WishlistResponse>> => {
      const { data } = await wishlistApi.getWishlist();
      return data;
    }
  }),

  checkProduct: (productId: string) => ({
    queryKey: ['check', productId],
    queryFn: async (): Promise<ApiResponse<boolean>> => {
      const { data } = await wishlistApi.checkProductInWishlist({ productId });
      return data;
    }
  })
});
