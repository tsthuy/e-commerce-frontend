import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queries } from '~/queries';

import { adminCustomerApi } from '~/services/admin-customer.api';
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

export function useDeleteAdminCustomer(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      await adminCustomerApi.deleteCustomer({ customerId });
    },
    onSuccess: () => {
      toast.success('Customer deleted successfully');
      queryClient.invalidateQueries({ queryKey: queries.adminCustomer.list._def });
    }
  });
}
