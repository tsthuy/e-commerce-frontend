import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse, SellerProfileResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

/**
 * Hook to fetch public seller profile information
 */
export function usePublicSellerProfile({ sellerId, enabled = true, retry = false }: UseQueryParams & { sellerId: string }): UseQueryResult<ApiResponse<SellerProfileResponse>> {
  const queryResponse = useQuery({
    ...queries.seller.getPublicProfile({ sellerId }),
    retry,
    enabled: enabled && !!sellerId
  });
  return queryResponse;
}
