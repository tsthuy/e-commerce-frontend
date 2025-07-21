import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { AdminOrderListParams, AdminOrderListResponse, AdminOrderResponse, AdminProductListParams, AdminProductListResponse, AdminProductResponse, UseQueryParams } from '~/types';

import { queries } from '~/queries';

// Admin Products Hooks
export interface UseAdminProductListParams extends UseQueryParams {
  data: AdminProductListParams;
}

export function useAdminProductList({ data, enabled = true, retry = false }: UseAdminProductListParams): UseQueryResult<AdminProductListResponse> {
  const queryResponse = useQuery({
    ...queries.admin.getAllProducts(data),
    retry,
    enabled
  });

  return queryResponse;
}

export function useAdminProductDetail({ productId, enabled = true, retry = false }: UseQueryParams & { productId: string }): UseQueryResult<AdminProductResponse> {
  const queryResponse = useQuery({
    ...queries.admin.getProductDetail(productId),
    retry,
    enabled: enabled && !!productId
  });

  return queryResponse;
}

// Admin Orders Hooks
export interface UseAdminOrderListParams extends UseQueryParams {
  data: AdminOrderListParams;
}

export function useAdminOrderList({ data, enabled = true, retry = false }: UseAdminOrderListParams): UseQueryResult<AdminOrderListResponse> {
  const queryResponse = useQuery({
    ...queries.admin.getAllOrders(data),
    retry,
    enabled
  });

  return queryResponse;
}

export function useAdminOrderDetail({ orderId, enabled = true, retry = false }: UseQueryParams & { orderId: string }): UseQueryResult<AdminOrderResponse> {
  const queryResponse = useQuery({
    ...queries.admin.getOrderDetail(orderId),
    retry,
    enabled: enabled && !!orderId
  });

  return queryResponse;
}
