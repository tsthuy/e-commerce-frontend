import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { ApiResponse, ProductReviewListParams, ProductReviewListResponse, QueryParams } from '~/types';

import { reviewApi } from '~/services';

export const reviewQueries = createQueryKeys('review', {
  getProductReviews: (params: QueryParams<ProductReviewListParams> & { productId: string }) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<ProductReviewListResponse>> => {
      const { data } = await reviewApi.getProductReviews(params);
      return data;
    }
  }),
  checkExists: (params: QueryParams<{ productId: string; orderId: string }>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ApiResponse<boolean>> => {
      const { data } = await reviewApi.checkExists(params);
      return data;
    }
  })
});
