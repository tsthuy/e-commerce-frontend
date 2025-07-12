import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ApiResponse, CreateReviewRequest, ProductReviewListParams, ProductReviewListResponse, ProductReviewResponse } from '~/types';

import { httpBase } from '~/services/config.service';

export const reviewApi = {
  create({ data, config }: ApiParams<CreateReviewRequest>): AxiosPromise<ApiResponse<ProductReviewResponse>> {
    return httpBase.post<CreateReviewRequest, ApiResponse<ProductReviewResponse>>(API_URLS.review.create, data, config);
  },

  getProductReviews({ productId, data, config }: ApiParams<ProductReviewListParams> & { productId: string }): AxiosPromise<ApiResponse<ProductReviewListResponse>> {
    return httpBase.get<ApiResponse<ProductReviewListResponse>>(API_URLS.review.getProductReviews(productId), {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  },

  checkExists({ data, config }: ApiParams<{ productId: string; orderId: string }>): AxiosPromise<ApiResponse<boolean>> {
    return httpBase.get<ApiResponse<boolean>>(API_URLS.review.checkExists, {
      ...config,
      params: {
        ...data,
        ...(config?.params || {})
      }
    });
  }
};
