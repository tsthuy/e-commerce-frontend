import type { AnyType, PaginationResponse } from './common';

// Order Status enum
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Payment Method enum
export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  ADVANCE_PAYMENT = 'ADVANCE_PAYMENT' // Stripe payment
}

// Payment Status enum
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Create Order Request
export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  cartItemIds?: string[]; // Optional: specific cart items to order
}

// Create Stripe Checkout Request
export interface CreateStripeCheckoutRequest {
  addressId?: string;
  notes?: string;
}

// Update Order Status Request
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

// Status transition option for dropdown
export interface OrderStatusTransition {
  status: OrderStatus;
  label: string;
  description: string;
  disabled?: boolean;
}

// Order Item Response
export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  productSku?: string;
  sellerName: string;
  categoryName?: string;
  unitPrice: number;
  salePrice?: number;
  quantity: number;
  subtotal: number;
  variantId?: string;
  variantName?: string;
  variantOptions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Address Info (from JSON in order)
export interface OrderAddressInfo {
  id: string;
  country: string;
  city: string;
  address: string;
  recipientPhone: string;
  zipCode?: string;
  addressType: string;
}

// Order Response
export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  sellerId: string;
  sellerName: string;
  sellerShopName: string;
  shippingAddress: OrderAddressInfo;
  billingAddress: OrderAddressInfo;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  items: OrderItemResponse[];
}

// Use common pagination response
export type OrderListResponse = PaginationResponse<OrderResponse>;

// Order Pagination Params
export interface OrderPaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: OrderStatus;
  search?: string;
}

// Order Summary for dashboard
export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

// Checkout Process Data
export interface CheckoutData {
  cartItems: AnyType[];
  selectedAddress: AnyType;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Use common pagination response
// export type OrderListResponse = PaginationResponse<OrderResponse>;
