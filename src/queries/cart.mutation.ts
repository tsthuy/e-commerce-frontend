import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiResponse } from '~/types';

import { queries } from '~/queries';

import { cartApi } from '~/services';

import { getErrorMessage } from '~/utils';

import type { AddToCartRequest, CartResponse, UpdateCartItemRequest } from '~/types/cart';

export function useAddToCartMutation(): UseMutationResult<ApiResponse<CartResponse>, Error, AddToCartRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.addToCart(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.cart.list._def });
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra khi thêm vào giỏ hàng'));
    }
  });
}

export function useUpdateCartItemMutation(): UseMutationResult<ApiResponse<CartResponse>, Error, { itemId: string; data: UpdateCartItemRequest }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) => cartApi.updateCartItem(itemId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.cart.list._def });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra khi cập nhật giỏ hàng'));
    }
  });
}

export function useRemoveCartItemMutation(): UseMutationResult<ApiResponse<CartResponse>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeCartItem(itemId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.cart.list._def });
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra khi xóa sản phẩm'));
    }
  });
}

export function useClearCartMutation(): UseMutationResult<ApiResponse<void>, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.cart.list._def });
      toast.success('Đã xóa toàn bộ giỏ hàng!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra khi xóa giỏ hàng'));
    }
  });
}
