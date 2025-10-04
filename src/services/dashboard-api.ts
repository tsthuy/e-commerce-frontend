import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ApiResponse } from '~/types';

import { httpBase } from '~/services/config.service';
import type { ChartType, DashboardChart, DashboardStats, PeriodType } from '~/types/dashboard';

export const dashboardApi = {
  getStats({ data, config }: ApiParams<{ period?: PeriodType }> = { data: {} }): AxiosPromise<ApiResponse<DashboardStats>> {
    return httpBase.get<ApiResponse<DashboardStats>>(API_URLS.dashboard.stats, {
      ...config,
      params: {
        period: data?.period || '7days',
        ...(config?.params || {})
      }
    });
  },

  getChart({ data, config }: ApiParams<{ period?: PeriodType; type?: ChartType }> = { data: {} }): AxiosPromise<ApiResponse<DashboardChart>> {
    return httpBase.get<ApiResponse<DashboardChart>>(API_URLS.dashboard.chart, {
      ...config,
      params: {
        period: data?.period || '7days',
        type: data?.type || 'daily',
        ...(config?.params || {})
      }
    });
  }
};
