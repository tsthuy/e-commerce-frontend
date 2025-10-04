/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse } from '~/types';

import { queries } from '~/queries';

import type { OrderListResponse, OrderPaginationParams, OrderResponse } from '~/types/order';

// Customer order hooks

/**
 * Hook to get customer orders with pagination
 */
export function useCustomerOrders({
  data = {},
  enabled = true,
  retry = false
}: {
  data?: OrderPaginationParams;
  enabled?: boolean;
  retry?: boolean;
} = {}): UseQueryResult<ApiResponse<OrderListResponse>> {
  return useQuery({
    ...queries.order.customerList(data),
    retry,
    enabled,
    refetchOnWindowFocus: false
  });
}

/**
 * Hook to get a specific order for customer
 */
export function useCustomerOrderDetail({ orderId, enabled = true, retry = false }: { orderId: string; enabled?: boolean; retry?: boolean }): UseQueryResult<ApiResponse<OrderResponse>> {
  return useQuery({
    ...queries.order.customerDetail(orderId),
    retry,
    enabled: enabled && !!orderId,
    refetchOnWindowFocus: false
  });
}

// Seller order hooks

/**
 * Hook to get seller orders with pagination
 */
export function useSellerOrders({
  data = {},
  enabled = true,
  retry = false
}: {
  data?: OrderPaginationParams;
  enabled?: boolean;
  retry?: boolean;
} = {}): UseQueryResult<ApiResponse<OrderListResponse>> {
  return useQuery({
    ...queries.order.sellerList(data),
    retry,
    enabled,
    refetchOnWindowFocus: false
  });
}

/**
 * Hook to get a specific order for seller
 */
export function useSellerOrderDetail({ orderId, enabled = true, retry = false }: { orderId: string; enabled?: boolean; retry?: boolean }): UseQueryResult<ApiResponse<OrderResponse>> {
  return useQuery({
    ...queries.order.sellerDetail(orderId),
    retry,
    enabled: enabled && !!orderId,
    refetchOnWindowFocus: false
  });
}
