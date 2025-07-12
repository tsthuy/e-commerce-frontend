import type { UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiResponse, CreateReviewRequest, ProductReviewListParams, ProductReviewListResponse, ProductReviewResponse } from '~/types';

import { reviewApi } from '~/services';

import { reviewQueries } from '~/queries/review.query';

/**
 * Hook to get product reviews with pagination
 */
export const useProductReviews = (params: ProductReviewListParams): UseQueryResult<ApiResponse<ProductReviewListResponse>> => {
  return useQuery({
    ...reviewQueries.getProductReviews({
      productId: params.productId,
      data: params
    }),
    enabled: !!params.productId
  });
};

/**
 * Hook to check if customer has already reviewed a product for an order
 */
export const useCheckReviewExists = (productId: string, orderId: string): UseQueryResult<ApiResponse<boolean>> => {
  return useQuery({
    ...reviewQueries.checkExists({ data: { productId, orderId } }),
    enabled: !!productId && !!orderId
  });
};

/**
 * Hook to create a product review
 */
export const useCreateReview = (): ReturnType<typeof useMutation<ProductReviewResponse, unknown, CreateReviewRequest>> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewRequest) => {
      const response = await reviewApi.create({ data });
      return response.data.result;
    },
    onSuccess: (_data: ProductReviewResponse, variables: CreateReviewRequest) => {
      toast.success('Review submitted successfully!');

      // Invalidate and refetch product reviews
      queryClient.invalidateQueries({
        queryKey: reviewQueries.getProductReviews._def
      });

      // Specifically invalidate reviews for this product
      queryClient.invalidateQueries({
        queryKey: reviewQueries.getProductReviews({
          productId: variables.productId,
          data: { productId: variables.productId, page: 0, size: 10 }
        }).queryKey
      });

      // Invalidate review existence check for this product/order
      queryClient.invalidateQueries({
        queryKey: reviewQueries.checkExists({
          data: {
            productId: variables.productId,
            orderId: variables.orderId
          }
        }).queryKey
      });

      // Invalidate product details to update average rating
      queryClient.invalidateQueries({
        queryKey: ['products', 'detail', variables.productId]
      });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
    }
  });
};
