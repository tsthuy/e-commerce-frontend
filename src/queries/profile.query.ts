import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ProfileResponse } from '~/types';

import { profileApi } from '~/services';

export const profileQueries = createQueryKeys('profile', {
  getProfile: () => ({
    queryKey: [''],
    queryFn: async (): Promise<ProfileResponse> => {
      const { data } = await profileApi.getProfile({});
      return data.result;
    }
  })
});
