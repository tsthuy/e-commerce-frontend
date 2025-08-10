import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse } from '~/types';

import { queries } from '~/queries';

import type { CartResponse } from '~/types/cart';

// Hook để lấy danh sách giỏ hàng
export function useCartList({ enabled = true, retry = false }: { enabled?: boolean; retry?: boolean } = {}): UseQueryResult<ApiResponse<CartResponse>> {
  const queryResponse = useQuery({
    ...queries.cart.list(),
    retry,
    enabled,
    select: (data) => {
      if (!data.result) {
        return {
          ...data,
          result: {
            id: '',
            customerId: '',
            totalItems: 0,
            totalPrice: 0,
            items: [],
            createdAt: '',
            updatedAt: ''
          }
        } as ApiResponse<CartResponse>;
      }
      return data;
    }
  });
  return queryResponse;
}
