import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type {
  AdminDashboardChartRequest,
  AdminDashboardStatsRequest,
  AdminDashboardStatsResponse,
  AdminLoginRequest,
  AdminProfileResponse,
  ApiParams,
  ApiResponse,
  AuthenticationResponse
} from '~/types';

import { httpBase } from './config.service';

export const adminApi = {
  loginAdmin({ data, config }: ApiParams<AdminLoginRequest>): AxiosPromise<ApiResponse<AuthenticationResponse>> {
    return httpBase.post<AdminLoginRequest, ApiResponse<AuthenticationResponse>>(API_URLS.admin.login, data, config);
  },

  getProfile({ config }: ApiParams): AxiosPromise<ApiResponse<AdminProfileResponse>> {
    return httpBase.get<ApiResponse<AdminProfileResponse>>(API_URLS.admin.profile, config);
  },

  getDashboardStats({ data, config }: ApiParams<AdminDashboardStatsRequest>): AxiosPromise<ApiResponse<AdminDashboardStatsResponse>> {
    return httpBase.get<ApiResponse<AdminDashboardStatsResponse>>(API_URLS.admin.dashboardStats, {
      params: data,
      ...config
    });
  },

  getDashboardChart({ data, config }: ApiParams<AdminDashboardChartRequest>): AxiosPromise<ApiResponse<unknown>> {
    return httpBase.get<ApiResponse<unknown>>(API_URLS.admin.dashboardChart, {
      params: data,
      ...config
    });
  }
};
