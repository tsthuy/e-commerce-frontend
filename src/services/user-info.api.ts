import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ApiResponse, UserInfoRequest, UserInfoResponse } from '~/types';

import { httpBase } from '~/services/config.service';

export const userInfoApi = {
  getUserInfo({ data, config }: ApiParams<UserInfoRequest>): AxiosPromise<ApiResponse<UserInfoResponse>> {
    return httpBase.get<ApiResponse<UserInfoResponse>>(API_URLS.userInfo.getUserInfo, {
      params: data,
      ...config
    });
  }
};
