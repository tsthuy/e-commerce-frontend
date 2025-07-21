/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaginationResponse } from './common';

import type { OrderResponse, OrderStatus, PaymentMethod } from '~/types/order';

export interface AdminOrderListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  orderNumber?: string;
  customerName?: string;
  sellerName?: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  minTotal?: number;
  maxTotal?: number;
  startDate?: string;
  endDate?: string;
}

// Use OrderResponse instead of AdminOrderResponse for consistency with seller
export type AdminOrderResponse = OrderResponse;

export type AdminOrderListResponse = PaginationResponse<AdminOrderResponse>;
