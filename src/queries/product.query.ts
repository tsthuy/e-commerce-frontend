import { createQueryKeys } from '@lukemorales/query-key-factory';

import type { QueryParams } from '~/types';

import { productApi } from '~/services/product.api';
import type { ProductDetailParams, ProductDetailResponseType, ProductListResponse, ProductPaginationParams } from '~/types/product';

export const productQueries = createQueryKeys('product', {
  list: (params: QueryParams<ProductPaginationParams>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ProductListResponse> => {
      const { data } = await productApi.list(params);
      return data.result;
    }
  }),
  sellerList: (params: QueryParams<ProductPaginationParams>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ProductListResponse> => {
      const { data } = await productApi.sellerList(params);
      return data.result;
    }
  }),
  detail: (params: QueryParams<ProductDetailParams>) => ({
    queryKey: [params],
    queryFn: async (): Promise<ProductDetailResponseType> => {
      const { data } = await productApi.detail(params);
      return data.result;
    }
  })
});
