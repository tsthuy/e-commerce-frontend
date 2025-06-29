import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiResponse } from '~/types';

import { queries } from '~/queries';

import { wishlistApi } from '~/services';

import { getErrorMessage } from '~/utils';

import type { AddToWishlistRequest, WishlistResponse } from '~/types/wishlist';

export function useToggleWishlistMutation(): UseMutationResult<ApiResponse<WishlistResponse>, Error, AddToWishlistRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToWishlistRequest) => wishlistApi.toggleWishlistItem({ data }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.wishlist.list._def });
      queryClient.invalidateQueries({ queryKey: queries.wishlist._def });
      toast.success('Đã cập nhật danh sách yêu thích');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
}

export function useRemoveWishlistItemMutation(): UseMutationResult<ApiResponse<WishlistResponse>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.removeWishlistItem({ productId }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.wishlist.list._def });
      queryClient.invalidateQueries({ queryKey: queries.wishlist._def });
      toast.success('Đã xóa khỏi danh sách yêu thích');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
}

export function useClearWishlistMutation(): UseMutationResult<ApiResponse<void>, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistApi.clearWishlist().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.wishlist.list._def });
      queryClient.invalidateQueries({ queryKey: queries.wishlist._def });
      toast.success('Đã xóa tất cả khỏi danh sách yêu thích');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
}
