import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { UseQueryParams } from '~/types';

import { productQueries } from '~/queries/product.query';
import type { ProductDetailParams, ProductDetailResponseType, ProductListResponse, ProductPaginationParams } from '~/types/product';

export function useProductList({ data, enabled = true, retry = false }: UseQueryParams<ProductPaginationParams>): UseQueryResult<ProductListResponse> {
  const queryResponse = useQuery({
    ...productQueries.list({ data }),
    retry,
    enabled
  });
  return queryResponse;
}

export function useSellerProductList({ data, enabled = true, retry = false }: UseQueryParams<ProductPaginationParams>): UseQueryResult<ProductListResponse> {
  const queryResponse = useQuery({
    ...productQueries.sellerList({ data }),
    retry,
    enabled
  });
  return queryResponse;
}

export function useAdminProductList({ data, enabled = true, retry = false }: UseQueryParams<ProductPaginationParams>): UseQueryResult<ProductListResponse> {
  const queryResponse = useQuery({
    ...productQueries.adminList({ data }),
    retry,
    enabled
  });
  return queryResponse;
}

export function useProductDetail({ data, enabled = true, retry = false }: UseQueryParams<ProductDetailParams>): UseQueryResult<ProductDetailResponseType> {
  const queryResponse = useQuery({
    ...productQueries.detail({ data }),
    retry,
    enabled
  });
  return queryResponse;
}
