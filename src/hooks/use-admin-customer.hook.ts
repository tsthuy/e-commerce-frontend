import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { queries } from '~/queries';

import type { AdminCustomerListResponse, AdminCustomerPaginationParams, AdminCustomerResponse } from '~/types/admin-customer';
import type { ApiResponse, UseQueryParams } from '~/types/api';

export function useAdminCustomerList({ data, enabled = true, retry = false }: UseQueryParams<AdminCustomerPaginationParams>): UseQueryResult<ApiResponse<AdminCustomerListResponse>> {
  const queryResponse = useQuery({
    ...queries.adminCustomer.list({ data }),
    retry,
    enabled
  });

  return queryResponse;
}

export function useAdminCustomerDetail({ customerId, retry = false, enabled = true }: UseQueryParams & { customerId: string }): UseQueryResult<ApiResponse<AdminCustomerResponse>> {
  const queryResponse = useQuery({
    ...queries.adminCustomer.detail({ customerId }),
    retry,
    enabled
  });

  return queryResponse;
}
