import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiResponse, QueryParams } from '~/types';

import { dashboardApi } from '~/services/dashboard-api';
import type { ChartType, DashboardChart, DashboardStats, PeriodType } from '~/types/dashboard';

export const dashboardQueries = createQueryKeys('dashboard', {
  stats: (params: QueryParams<{ period?: PeriodType }>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<DashboardStats>> => {
      const { data } = await dashboardApi.getStats(params);
      return data;
    }
  }),
  chart: (params: QueryParams<{ period?: PeriodType; type?: ChartType }>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<DashboardChart>> => {
      const { data } = await dashboardApi.getChart(params);
      return data;
    }
  })
});
