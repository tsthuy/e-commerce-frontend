import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { UseQueryParams, UserInfoResponse } from '~/types';

import { queries } from '~/queries';

interface UseInfoUserForChatParams extends UseQueryParams {
  id: string;
  type: 'customer' | 'seller';
}

export function useInfoUserForChat({ id, type, enabled = true, retry = false }: UseInfoUserForChatParams): UseQueryResult<UserInfoResponse> {
  const queryResponse = useQuery({
    ...queries.userInfo.getUserInfo({ id, type }),
    retry,
    enabled: enabled && !!id
  });

  return queryResponse;
}
