import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { AdminDashboardStatsResponse, AdminProfileResponse } from '~/types';

import { adminApi } from '~/services';

export const adminQueries = createQueryKeys('admin', {
  getProfile: () => ({
    queryKey: [''],
    queryFn: async (): Promise<AdminProfileResponse> => {
      const { data } = await adminApi.getProfile({});
      return data.result;
    }
  }),
  getDashboardStats: (period: string) => ({
    queryKey: ['stats', period],
    queryFn: async (): Promise<AdminDashboardStatsResponse> => {
      const { data } = await adminApi.getDashboardStats({ data: { period } });
      return data.result;
    }
  }),
  getDashboardChart: (period: string, type: string) => ({
    queryKey: ['chart', period, type],
    queryFn: async (): Promise<unknown> => {
      const { data } = await adminApi.getDashboardChart({ data: { period, type } });
      return data.result;
    }
  })
});
