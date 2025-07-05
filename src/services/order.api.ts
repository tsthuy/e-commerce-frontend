import type { AxiosPromise } from 'axios';

import { API_ENDPOINTS } from '~/constants';

import type { ApiResponse } from '~/types';

import { httpBase } from '~/services/config.service';
import type { CreateOrderRequest, OrderListResponse, OrderPaginationParams, OrderResponse, OrderStatusTransition, UpdateOrderStatusRequest } from '~/types/order';

export const orderApi = {
  // Customer APIs
  // Get customer orders with pagination
  getCustomerOrders: (params?: OrderPaginationParams): AxiosPromise<ApiResponse<OrderListResponse>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.list, { params });
  },

  // Create new order from cart
  createOrder: (data: CreateOrderRequest): AxiosPromise<ApiResponse<OrderResponse>> => {
    return httpBase.post<CreateOrderRequest, ApiResponse<OrderResponse>>(API_ENDPOINTS.ORDER.create, data);
  },

  // Get order detail
  getOrderDetail: (orderId: string): AxiosPromise<ApiResponse<OrderResponse>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.detail(orderId));
  },

  // Cancel order
  cancelOrder: (orderId: string, reason?: string): AxiosPromise<ApiResponse<void>> => {
    return httpBase.post(API_ENDPOINTS.ORDER.cancel(orderId), { reason });
  },

  // Seller APIs
  // Get seller orders with pagination
  getSellerOrders: (params?: OrderPaginationParams): AxiosPromise<ApiResponse<OrderListResponse>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.sellerList, { params });
  },

  // Update order status (seller only)
  updateOrderStatus: (orderId: string, data: UpdateOrderStatusRequest): AxiosPromise<ApiResponse<OrderResponse>> => {
    return httpBase.put(API_ENDPOINTS.ORDER.updateStatus(orderId), data);
  },

  // Get available status transitions for an order
  getStatusTransitions: (orderId: string): AxiosPromise<ApiResponse<OrderStatusTransition[]>> => {
    return httpBase.get(API_ENDPOINTS.ORDER.statusTransitions(orderId));
  }
};
