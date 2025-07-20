import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { AdminDashboardStatsResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

export interface UseAdminDashboardParams extends UseQueryParams {
  data: {
    period: string;
  };
}

export interface UseAdminDashboardChartParams extends UseQueryParams {
  data: {
    period: string;
    type: string;
  };
}

export function useAdminDashboardStats({ data, enabled = true, retry = false }: UseAdminDashboardParams): UseQueryResult<AdminDashboardStatsResponse> {
  const queryResponse = useQuery({
    ...queries.admin.getDashboardStats(data.period),
    retry,
    enabled
  });

  return queryResponse;
}

export function useAdminDashboardChart({ data, enabled = true, retry = false }: UseAdminDashboardChartParams): UseQueryResult<unknown> {
  const queryResponse = useQuery({
    ...queries.admin.getDashboardChart(data.period, data.type),
    retry,
    enabled
  });

  return queryResponse;
}
