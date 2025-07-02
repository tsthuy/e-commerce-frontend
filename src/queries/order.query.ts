import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiResponse, OrderListResponse, OrderPaginationParams, OrderResponse } from '~/types';

import { orderApi } from '~/services';

export const orderQueries = createQueryKeys('order', {
  // Customer order queries
  customerList: (params?: OrderPaginationParams) => ({
    queryKey: ['customer-list', params],
    queryFn: async (): Promise<ApiResponse<OrderListResponse>> => {
      const { data } = await orderApi.getCustomerOrders(params);
      return data;
    }
  }),

  customerDetail: (orderId: string) => ({
    queryKey: ['customer-detail', orderId],
    queryFn: async (): Promise<ApiResponse<OrderResponse>> => {
      const { data } = await orderApi.getOrderDetail(orderId);
      return data;
    }
  }),

  // Seller order queries
  sellerList: (params?: OrderPaginationParams) => ({
    queryKey: ['seller-list', params],
    queryFn: async (): Promise<ApiResponse<OrderListResponse>> => {
      const { data } = await orderApi.getSellerOrders(params);
      return data;
    }
  }),

  sellerDetail: (orderId: string) => ({
    queryKey: ['seller-detail', orderId],
    queryFn: async (): Promise<ApiResponse<OrderResponse>> => {
      const { data } = await orderApi.getOrderDetail(orderId);
      return data;
    }
  })
});
