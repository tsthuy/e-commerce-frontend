/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useAddToCartMutation, useClearCartMutation, useRemoveCartItemMutation, useUpdateCartItemMutation } from '~/queries/cart.mutation';

// Hook để thêm sản phẩm vào giỏ hàng
export function useAddToCart() {
  return useAddToCartMutation();
}

// Hook để cập nhật item trong giỏ hàng
export function useUpdateCartItem() {
  return useUpdateCartItemMutation();
}

// Hook để xóa item khỏi giỏ hàng
export function useRemoveCartItem() {
  return useRemoveCartItemMutation();
}

// Hook để xóa toàn bộ giỏ hàng
export function useClearCart() {
  return useClearCartMutation();
}
