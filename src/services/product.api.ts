import type { AxiosPromise, AxiosRequestConfig } from 'axios';

import { API_URLS } from '~/constants';

import type { ProductDetailParams, ProductDetailResponseType, ProductListResponse, ProductPaginationParams, ProductPayload } from '~/types';

import type { ApiParams, ApiResponse } from './../types';

import { httpBase } from '~/services/config.service';

export const productApi = {
  list({ data, config }: ApiParams<ProductPaginationParams>): AxiosPromise<ApiResponse<ProductListResponse>> {
    return httpBase.get<ApiResponse<ProductListResponse>>(API_URLS.product.getAllPaged, {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  },

  sellerList({ data, config }: ApiParams<ProductPaginationParams>): AxiosPromise<ApiResponse<ProductListResponse>> {
    return httpBase.get<ApiResponse<ProductListResponse>>(API_URLS.product.getSellerPaged, {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  },

  publicSellerList({ sellerId, data, config }: ApiParams<ProductPaginationParams> & { sellerId: string }): AxiosPromise<ApiResponse<ProductListResponse>> {
    return httpBase.get<ApiResponse<ProductListResponse>>(API_URLS.product.getPublicSellerPaged(sellerId), {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  },

  adminList({ data, config }: ApiParams<ProductPaginationParams>): AxiosPromise<ApiResponse<ProductListResponse>> {
    return httpBase.get<ApiResponse<ProductListResponse>>(API_URLS.admin.allProducts, {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  },

  detail({ data: { productId }, config }: ApiParams<ProductDetailParams>): AxiosPromise<ApiResponse<ProductDetailResponseType>> {
    return httpBase.get<ApiResponse<ProductDetailResponseType>>(API_URLS.product.detail(productId), config);
  },

  getAllPaged({
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    search,
    config
  }: ApiParams & {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string;
  } = {}): AxiosPromise<ApiResponse<ProductListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection,
      ...(search && { search })
    });

    return httpBase.get(`${API_URLS.product.getAllPaged}?${params}`, config);
  },

  getSellerPaged({
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    search,
    config
  }: ApiParams & {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string;
  } = {}): AxiosPromise<ApiResponse<ProductListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection,
      ...(search && { search })
    });

    return httpBase.get(`${API_URLS.product.getSellerPaged}?${params}`, config);
  },

  create({ data, config }: ApiParams<ProductPayload>): AxiosPromise<ApiResponse<void>> {
    return httpBase.post<ProductPayload, ApiResponse<void>>(API_URLS.product.create, data, config);
  },

  detailLegacy({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<ProductDetailResponseType>> {
    return httpBase.get(API_URLS.product.detail(productId), config);
  },

  update({ productId, data, config }: ApiParams<ProductPayload> & { productId: string }): AxiosPromise<ApiResponse<void>> {
    return httpBase.put<ProductPayload, ApiResponse<void>>(API_URLS.product.update(productId), data, config);
  },

  delete({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<void>> {
    return httpBase.delete(API_URLS.product.delete(productId), config);
  },

  semanticSearch({ data, config }: { data: { query: string; page?: number; size?: number }; config?: AxiosRequestConfig }): AxiosPromise<ApiResponse<ProductListResponse>> {
    return httpBase.get<ApiResponse<ProductListResponse>>('/api/products/semantic-search', {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  },

  /**
   * Get personalized product recommendations
   */
  recommendations({ data, config }: { data: { page?: number; size?: number }; config?: AxiosRequestConfig }): AxiosPromise<ApiResponse<ProductListResponse>> {
    return httpBase.get<ApiResponse<ProductListResponse>>('/api/products/recommendations', {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  }
};
