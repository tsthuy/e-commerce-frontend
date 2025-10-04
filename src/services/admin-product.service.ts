import type { AxiosPromise } from 'axios';

import type { ApiResponse, PaginationResponse, Product } from '~/types';

import { httpBase } from '~/services/config.service';

interface GetAllProductsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
  name?: string;
  categoryName?: string;
  status?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const adminProductService = {
  getAllProducts: (params: GetAllProductsParams = {}): AxiosPromise<ApiResponse<PaginationResponse<Product>>> => {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    if (params.name) searchParams.append('name', params.name);
    if (params.categoryName) searchParams.append('categoryName', params.categoryName);
    if (params.status) searchParams.append('status', params.status);
    if (params.sellerId) searchParams.append('sellerId', params.sellerId);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());

    const queryString = searchParams.toString();
    const url = `/admin/products${queryString ? `?${queryString}` : ''}`;

    return httpBase.get(url);
  },

  getProductDetail: (productId: string): AxiosPromise<ApiResponse<Product>> => {
    return httpBase.get(`/admin/products/${productId}`);
  },

  updateProductStatus: (productId: string, status: string): AxiosPromise<ApiResponse<Product>> => {
    return httpBase.put(`/admin/products/${productId}/status`, null, {
      params: { status }
    });
  },

  deleteProduct: (productId: string): AxiosPromise<ApiResponse<string>> => {
    return httpBase.delete(`/admin/products/${productId}`);
  }
};
