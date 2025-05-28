import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ApiResponse, CreateAddressRequest, ProfileResponse, UpdateProfileRequest } from '~/types';

import { httpBase } from '~/services';

export const profileApi = {
  getProfile({ config }: ApiParams): AxiosPromise<ApiResponse<ProfileResponse>> {
    return httpBase.get<ApiResponse<ProfileResponse>>(API_URLS.profile.getProfile, config);
  },
  updateProfile({ data, config }: ApiParams<UpdateProfileRequest>): AxiosPromise<void> {
    return httpBase.patch<UpdateProfileRequest, void>(API_URLS.profile.updateProfile, data, config);
  },
  createAddress({ data, config }: ApiParams<CreateAddressRequest>): AxiosPromise<void> {
    return httpBase.post<CreateAddressRequest, void>(API_URLS.profile.createAddress, data, config);
  },
  deleteAddress({ addressId, config }: ApiParams & { addressId: string }): AxiosPromise<void> {
    return httpBase.delete<void>(API_URLS.profile.deleteAddress(addressId), config);
  }
};
