import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queries } from '~/queries';

import { adminSellerApi } from '~/services/admin-seller.api';
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

export function useDeleteAdminSeller(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sellerId: string) => {
      await adminSellerApi.deleteSeller({ sellerId });
    },
    onSuccess: () => {
      toast.success('Seller deleted successfully');
      queryClient.invalidateQueries({ queryKey: queries.adminSeller.list._def });
    }
  });
}
