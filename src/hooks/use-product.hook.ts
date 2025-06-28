/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/constants';

import { productApi } from '~/services/product.api';

interface UseProductListParams {
  data: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    search?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useProductList = ({ data }: UseProductListParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.product.list, data],
    queryFn: () => productApi.getAllPaged(data),
    select: (response) => response.data,
    staleTime: 30000, // 30 seconds
    gcTime: 300000 // 5 minutes
  });
};

interface UseSellerProductListParams {
  data: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    search?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useSellerProductList = ({ data }: UseSellerProductListParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.product.sellerList, data],
    queryFn: () => productApi.getSellerPaged(data),
    select: (response) => response.data,
    staleTime: 30000, // 30 seconds
    gcTime: 300000 // 5 minutes
  });
};

interface UseProductDetailParams {
  productId: string;
  enabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useProductDetail = ({ productId, enabled = true }: UseProductDetailParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.product.detail, productId],
    queryFn: () => productApi.detail({ productId }),
    select: (response) => response.data.result,
    enabled: enabled && !!productId,
    staleTime: 30000, // 30 seconds
    gcTime: 300000 // 5 minutes
  });
};
