import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { queries } from '~/queries';

import type { AdminSellerListResponse, AdminSellerPaginationParams, AdminSellerResponse } from '~/types/admin-seller';
import type { ApiResponse, UseQueryParams } from '~/types/api';

export function useAdminSellerList({ data, enabled = true, retry = false }: UseQueryParams<AdminSellerPaginationParams>): UseQueryResult<ApiResponse<AdminSellerListResponse>> {
  const queryResponse = useQuery({
    ...queries.adminSeller.list({ data }),
    retry,
    enabled
  });

  return queryResponse;
}

export function useAdminSellerDetail({ sellerId, retry = false, enabled = true }: UseQueryParams & { sellerId: string }): UseQueryResult<ApiResponse<AdminSellerResponse>> {
  const queryResponse = useQuery({
    ...queries.adminSeller.detail({ sellerId }),
    retry,
    enabled
  });

  return queryResponse;
}
