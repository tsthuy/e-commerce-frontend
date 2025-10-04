import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

import type { ChartType, DashboardChart, DashboardStats, PeriodType } from '~/types/dashboard';

export function useDashboardStats({ data, enabled = true, retry = false }: UseQueryParams<{ period?: PeriodType }>): UseQueryResult<ApiResponse<DashboardStats>> {
  const queryResponse = useQuery({
    ...queries.dashboard.stats({ data }),
    retry,
    enabled
  });
  return queryResponse;
}

export function useDashboardChart({ data, enabled = true, retry = false }: UseQueryParams<{ period?: PeriodType; type?: ChartType }>): UseQueryResult<ApiResponse<DashboardChart>> {
  const queryResponse = useQuery({
    ...queries.dashboard.chart({ data }),
    retry,
    enabled
  });
  return queryResponse;
}
