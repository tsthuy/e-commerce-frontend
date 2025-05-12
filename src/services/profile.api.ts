import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ProfileResponse } from '~/types';

import { httpBase } from '~/services';

export const profileApi = {
  getProfile({ config }: ApiParams): AxiosPromise<ProfileResponse> {
    return httpBase.get<ProfileResponse>(API_URLS.profile.getProfile, config);
  }
};
