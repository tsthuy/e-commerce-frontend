import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ProfileResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

export function useProfile({ enabled = true, retry = false }: UseQueryParams): UseQueryResult<ProfileResponse> {
  const queryResponse = useQuery({ ...queries.profile.getProfile(), retry, enabled });

  return queryResponse;
}
