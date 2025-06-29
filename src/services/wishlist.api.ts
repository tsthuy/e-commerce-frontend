import type { AxiosPromise } from 'axios';

import { API_URLS } from '~/constants';

import type { ApiParams, ApiResponse } from '~/types';

import { httpBase } from '~/services/config.service';
import type { AddToWishlistRequest, WishlistResponse } from '~/types/wishlist';

export const wishlistApi = {
  getWishlist({ config }: ApiParams = {}): AxiosPromise<ApiResponse<WishlistResponse>> {
    return httpBase.get<ApiResponse<WishlistResponse>>(API_URLS.wishlist.list, config);
  },

  toggleWishlistItem({ data, config }: ApiParams<AddToWishlistRequest>): AxiosPromise<ApiResponse<WishlistResponse>> {
    return httpBase.post<AddToWishlistRequest, ApiResponse<WishlistResponse>>(API_URLS.wishlist.toggle, data!, config);
  },

  removeWishlistItem({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<WishlistResponse>> {
    return httpBase.delete<ApiResponse<WishlistResponse>>(API_URLS.wishlist.removeItem(productId), config);
  },

  checkProductInWishlist({ productId, config }: ApiParams & { productId: string }): AxiosPromise<ApiResponse<boolean>> {
    return httpBase.get<ApiResponse<boolean>>(API_URLS.wishlist.check(productId), config);
  },

  clearWishlist({ config }: ApiParams = {}): AxiosPromise<ApiResponse<void>> {
    return httpBase.delete<ApiResponse<void>>(API_URLS.wishlist.clear, config);
  }
};
