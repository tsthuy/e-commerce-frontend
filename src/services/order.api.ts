import type { AxiosPromise } from 'axios';

import { API_ENDPOINTS } from '~/constants';

import type { ApiResponse } from '~/types';

import { httpBase } from '~/services/config.service';
import type { CreateOrderRequest, OrderListResponse, OrderPaginationParams, OrderResponse, OrderStatusTransition, UpdateOrderStatusRequest } from '~/types/order';

export const orderApi = {
  getCustomerOrders: (params?: OrderPaginationParams): AxiosPromise<ApiResponse<OrderListResponse>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.list, { params });
  },
  createOrder: (data: CreateOrderRequest): AxiosPromise<ApiResponse<OrderResponse>> => {
    return httpBase.post<CreateOrderRequest, ApiResponse<OrderResponse>>(API_ENDPOINTS.ORDER.create, data);
  },
  getOrderDetail: (orderId: string): AxiosPromise<ApiResponse<OrderResponse>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.detail(orderId));
  },
  cancelOrder: (orderId: string, reason?: string): AxiosPromise<ApiResponse<void>> => {
    return httpBase.post(API_ENDPOINTS.ORDER.cancel(orderId), { reason });
  },

  getSellerOrders: (params?: OrderPaginationParams): AxiosPromise<ApiResponse<OrderListResponse>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.sellerList, { params });
  },
  updateOrderStatus: (orderId: string, data: UpdateOrderStatusRequest): AxiosPromise<ApiResponse<OrderResponse>> => {
    return httpBase.put(API_ENDPOINTS.ORDER.updateStatus(orderId), data);
  },

  getStatusTransitions: (orderId: string): AxiosPromise<ApiResponse<OrderStatusTransition[]>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.statusTransitions(orderId));
  }
};
