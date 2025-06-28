import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ApiResponse, CategoryListResponse, CategoryPaginationParams, CategoryRequest, CategoryResponse } from '~/types';

import { httpBase } from '~/services/config.service';

export const categoryApi = {
  getAll({ config }: ApiParams = {}): AxiosPromise<ApiResponse<CategoryResponse[]>> {
    return httpBase.get<ApiResponse<CategoryResponse[]>>(API_URLS.category.getAll, config);
  },

  getAllPaged({ data, config }: ApiParams<CategoryPaginationParams>): AxiosPromise<ApiResponse<CategoryListResponse>> {
    return httpBase.get<ApiResponse<CategoryListResponse>>(API_URLS.category.getAllPaged, {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  },

  create({ data, config }: ApiParams<CategoryRequest>): AxiosPromise<ApiResponse<CategoryResponse>> {
    return httpBase.post<CategoryRequest, ApiResponse<CategoryResponse>>(API_URLS.category.create, data, config);
  },

  update({ categoryId, data, config }: ApiParams<CategoryRequest> & { categoryId: string }): AxiosPromise<ApiResponse<CategoryResponse>> {
    return httpBase.put<CategoryRequest, ApiResponse<CategoryResponse>>(API_URLS.category.update(categoryId), data, config);
  },

  delete({ categoryId, config }: ApiParams & { categoryId: string }): AxiosPromise<ApiResponse<void>> {
    return httpBase.delete<ApiResponse<void>>(API_URLS.category.delete(categoryId), config);
  },

  detail({ categoryId, config }: ApiParams & { categoryId: string }): AxiosPromise<ApiResponse<CategoryResponse>> {
    return httpBase.get<ApiResponse<CategoryResponse>>(API_URLS.category.detail(categoryId), config);
  }
};
