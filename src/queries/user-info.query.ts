import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { UserInfoRequest, UserInfoResponse } from '~/types';

import { userInfoApi } from '~/services';

export const userInfoQueries = createQueryKeys('userInfo', {
  getUserInfo: (params: UserInfoRequest) => ({
    queryKey: [params],
    queryFn: async (): Promise<UserInfoResponse> => {
      const { data } = await userInfoApi.getUserInfo({ data: params });
      return data.result;
    }
  })
});
