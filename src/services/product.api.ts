import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ProductListResponse, ProductPayload } from '~/types';

import type { ApiParams, ApiResponse } from './../types';
import type { ProductDetailResponse } from './../types/product.d';

import { httpBase } from '~/services/config.service';

export const productApi = {
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

  detail({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<ProductDetailResponse>> {
    return httpBase.get(API_URLS.product.detail(productId), config);
  },

  update({ productId, data, config }: ApiParams<ProductPayload> & { productId: string }): AxiosPromise<ApiResponse<void>> {
    return httpBase.put<ProductPayload, ApiResponse<void>>(API_URLS.product.update(productId), data, config);
  },

  delete({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<void>> {
    return httpBase.delete(API_URLS.product.delete(productId), config);
  }
};
