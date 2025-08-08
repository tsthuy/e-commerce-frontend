import { useEffect, useState } from 'react';

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { UseQueryParams } from '~/types';

import { useDebounce } from '~/hooks/use-debounce.hook';
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

export function useProductSemanticSearch({ data, enabled = true, retry = false }: UseQueryParams<{ query: string; page?: number; size?: number }>): UseQueryResult<ProductListResponse> {
  const queryResponse = useQuery({
    ...productQueries.semanticSearch({ data }),
    retry,
    enabled
  });
  return queryResponse;
}

/**
 * Debounced semantic search hook - chờ 5 giây sau khi user ngừng gõ
 */
export function useProductSemanticSearchDebounced({
  query,
  page = 0,
  size = 8,
  enabled = true,
  retry = false
}: {
  query: string;
  page?: number;
  size?: number;
  enabled?: boolean;
  retry?: boolean;
}): UseQueryResult<ProductListResponse> & { isDebouncing: boolean } {
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce query với 5 giây
  const debouncedQuery = useDebounce(query, 5000);

  // Track debouncing state
  useEffect(() => {
    if (query !== debouncedQuery && query.trim() !== '') {
      setIsDebouncing(true);
    } else {
      setIsDebouncing(false);
    }
  }, [query, debouncedQuery]);

  const queryResponse = useQuery({
    ...productQueries.semanticSearch({
      data: {
        query: debouncedQuery,
        page,
        size
      }
    }),
    retry,
    enabled: enabled && !!debouncedQuery && debouncedQuery.trim() !== ''
  });

  return {
    ...queryResponse,
    isDebouncing
  };
}
