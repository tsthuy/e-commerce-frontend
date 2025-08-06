import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type {
  AdminDashboardChart,
  AdminDashboardChartRequest,
  AdminDashboardStatsRequest,
  AdminDashboardStatsResponse,
  AdminLoginRequest,
  AdminOrderListParams,
  AdminOrderListResponse,
  AdminOrderResponse,
  AdminProductListParams,
  AdminProductListResponse,
  AdminProductResponse,
  AdminProfileResponse,
  ApiParams,
  ApiResponse,
  AuthenticationResponse
} from '~/types';

import { httpBase } from './config.service';

export const adminApi = {
  loginAdmin({ data, config }: ApiParams<AdminLoginRequest>): AxiosPromise<AuthenticationResponse> {
    return httpBase.post<AdminLoginRequest, AuthenticationResponse>(API_URLS.admin.login, data, config);
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

  getDashboardChart({ data, config }: ApiParams<AdminDashboardChartRequest>): AxiosPromise<ApiResponse<AdminDashboardChart>> {
    return httpBase.get<ApiResponse<AdminDashboardChart>>(API_URLS.admin.dashboardChart, {
      params: data,
      ...config
    });
  },

  // Admin Products Management
  getAllProducts({ data, config }: ApiParams<AdminProductListParams>): AxiosPromise<ApiResponse<AdminProductListResponse>> {
    return httpBase.get<ApiResponse<AdminProductListResponse>>(API_URLS.admin.allProducts, {
      params: data,
      ...config
    });
  },

  getProductDetail({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<AdminProductResponse>> {
    return httpBase.get<ApiResponse<AdminProductResponse>>(API_URLS.admin.productDetail(productId), config);
  },

  deleteProduct({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<void>> {
    return httpBase.delete<ApiResponse<void>>(API_URLS.admin.deleteProduct(productId), config);
  },

  // Admin Orders Management
  getAllOrders({ data, config }: ApiParams<AdminOrderListParams>): AxiosPromise<ApiResponse<AdminOrderListResponse>> {
    return httpBase.get<ApiResponse<AdminOrderListResponse>>(API_URLS.admin.allOrders, {
      params: data,
      ...config
    });
  },

  getOrderDetail({ orderId, config }: ApiParams & { orderId: string }): AxiosPromise<ApiResponse<AdminOrderResponse>> {
    return httpBase.get<ApiResponse<AdminOrderResponse>>(API_URLS.admin.orderDetail(orderId), config);
  },

  updateOrderStatus({ orderId, data, config }: ApiParams<{ status: string }> & { orderId: string }): AxiosPromise<ApiResponse<AdminOrderResponse>> {
    return httpBase.put<{ status: string }, ApiResponse<AdminOrderResponse>>(API_URLS.admin.updateOrderStatus(orderId), data, config);
  }
};
