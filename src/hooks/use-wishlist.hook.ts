import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse } from '~/types';

import { queries } from '~/queries';

import type { WishlistResponse } from '~/types/wishlist';

export function useWishlistList({ enabled = true, retry = false }: { enabled?: boolean; retry?: boolean } = {}): UseQueryResult<ApiResponse<WishlistResponse>> {
  const queryResponse = useQuery({
    ...queries.wishlist.list(),
    retry,
    enabled,
    select: (data) => {
      if (!data.result) {
        return {
          ...data,
          result: {
            id: '',
            customerId: '',
            name: 'Default Wishlist',
            totalItems: 0,
            items: [],
            createdAt: '',
            updatedAt: ''
          }
        } as ApiResponse<WishlistResponse>;
      }
      return data;
    }
  });
  return queryResponse;
}

// Hook để check product có trong wishlist không
export function useCheckProductInWishlist(productId: string, { enabled = true }: { enabled?: boolean } = {}): UseQueryResult<ApiResponse<boolean>> {
  const queryResponse = useQuery({
    ...queries.wishlist.checkProduct(productId),
    enabled: enabled && !!productId,
    retry: false,
    select: (data) => {
      if (!data.result) {
        return {
          ...data,
          result: false
        } as ApiResponse<boolean>;
      }
      return data;
    }
  });
  return queryResponse;
}
