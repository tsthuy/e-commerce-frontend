import { createQueryKeys } from '@lukemorales/query-key-factory';

import type {
  AdminDashboardChart,
  AdminDashboardStatsResponse,
  AdminOrderListParams,
  AdminOrderListResponse,
  AdminOrderResponse,
  AdminProductListParams,
  AdminProductListResponse,
  AdminProductResponse,
  AdminProfileResponse
} from '~/types';

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
    queryFn: async (): Promise<AdminDashboardChart> => {
      const { data } = await adminApi.getDashboardChart({ data: { period, type } });
      return data.result;
    }
  }),
  getAllProducts: (params: AdminProductListParams) => ({
    queryKey: ['products', params],
    queryFn: async (): Promise<AdminProductListResponse> => {
      const { data } = await adminApi.getAllProducts({ data: params });
      return data.result;
    }
  }),

  getProductDetail: (productId: string) => ({
    queryKey: ['product', productId],
    queryFn: async (): Promise<AdminProductResponse> => {
      const { data } = await adminApi.getProductDetail({ productId });
      return data.result;
    }
  }),

  getAllOrders: (params: AdminOrderListParams) => ({
    queryKey: ['orders', params],
    queryFn: async (): Promise<AdminOrderListResponse> => {
      const { data } = await adminApi.getAllOrders({ data: params });
      return data.result;
    }
  }),

  getOrderDetail: (orderId: string) => ({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<AdminOrderResponse> => {
      const { data } = await adminApi.getOrderDetail({ orderId });
      return data.result;
    }
  })
});
