import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse, ProductListResponse, ProductPaginationParams, UseQueryParams } from '~/types';

import { queries } from '~/queries';

/**
 * Hook to fetch public seller's products with pagination and filtering
 */
export function usePublicSellerProducts({
  sellerId,
  data,
  enabled = true,
  retry = false
}: UseQueryParams<ProductPaginationParams> & { sellerId: string }): UseQueryResult<ApiResponse<ProductListResponse>> {
  const queryResponse = useQuery({
    ...queries.product.publicSellerList({ sellerId, data }),
    retry,
    enabled: enabled && !!sellerId
  });
  return queryResponse;
}
