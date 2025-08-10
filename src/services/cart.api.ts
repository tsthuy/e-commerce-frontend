import type { AxiosPromise } from 'axios';

import { API_ENDPOINTS } from '~/constants';

import type { ApiResponse } from '~/types';

import { httpBase } from '~/services/config.service';
import type { AddToCartRequest, CartResponse, UpdateCartItemRequest } from '~/types/cart';

export const cartApi = {
  addToCart: (data: AddToCartRequest): AxiosPromise<ApiResponse<CartResponse>> => {
    return httpBase.post<AddToCartRequest, ApiResponse<CartResponse>>(API_ENDPOINTS.CART.add, data);
  },
  getCart: (): AxiosPromise<ApiResponse<CartResponse>> => {
    return httpBase.get(API_ENDPOINTS.CART.list);
  },
  updateCartItem: (itemId: string, data: UpdateCartItemRequest): AxiosPromise<ApiResponse<CartResponse>> => {
    return httpBase.put(API_ENDPOINTS.CART.updateItem(itemId), data);
  },
  removeCartItem: (itemId: string): AxiosPromise<ApiResponse<CartResponse>> => {
    return httpBase.delete(API_ENDPOINTS.CART.removeItem(itemId));
  },

  clearCart: (): AxiosPromise<ApiResponse<void>> => {
    return httpBase.delete(API_ENDPOINTS.CART.clear);
  }
};
