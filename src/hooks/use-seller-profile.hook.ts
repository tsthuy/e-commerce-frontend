import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { SellerProfileResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

export function useSellerProfile({ enabled = true, retry = false }: UseQueryParams): UseQueryResult<SellerProfileResponse> {
  const queryResponse = useQuery({ ...queries.seller.getProfile(), retry, enabled });

  return queryResponse;
}
