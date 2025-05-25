import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ProfileApiResponse, UpdateProfileRequest } from '~/types';

import { httpBase } from '~/services';

export const profileApi = {
  getProfile({ config }: ApiParams): AxiosPromise<ProfileApiResponse> {
    return httpBase.get<ProfileApiResponse>(API_URLS.profile.getProfile, config);
  },
  updateProfile({ data, config }: ApiParams<UpdateProfileRequest>): AxiosPromise<void> {
    return httpBase.patch<UpdateProfileRequest, void>(API_URLS.profile.updateProfile, data, config);
  }
};
