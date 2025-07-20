import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { AdminProfileResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

export function useAdminProfile({ enabled = true, retry = false }: UseQueryParams): UseQueryResult<AdminProfileResponse> {
  const queryResponse = useQuery({ ...queries.admin.getProfile(), retry, enabled });

  return queryResponse;
}
