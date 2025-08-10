import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiResponse } from '~/types';

import { queries } from '~/queries';

import { orderApi } from '~/services';

import { getErrorMessage } from '~/utils';

import type { CreateOrderRequest, OrderResponse, UpdateOrderStatusRequest } from '~/types/order';

export function useCreateOrderMutation(): UseMutationResult<ApiResponse<OrderResponse>, Error, CreateOrderRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.cart.list._def });
      queryClient.invalidateQueries({ queryKey: queries.order.customerList._def });
      toast.success('Đặt hàng thành công!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra khi đặt hàng'));
    }
  });
}

export function useCancelOrderMutation(): UseMutationResult<ApiResponse<void>, Error, { orderId: string; reason?: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) => orderApi.cancelOrder(orderId, reason).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.order.customerList._def });
      queryClient.invalidateQueries({ queryKey: queries.order.customerDetail._def });
      toast.success('Đã hủy đơn hàng!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra khi hủy đơn hàng'));
    }
  });
}

export function useUpdateOrderStatusMutation(): UseMutationResult<ApiResponse<OrderResponse>, Error, { orderId: string; data: UpdateOrderStatusRequest }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }) => orderApi.updateOrderStatus(orderId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.order.sellerList._def });
      queryClient.invalidateQueries({ queryKey: queries.order.sellerDetail._def });
      toast.success('Đã cập nhật trạng thái đơn hàng!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Có lỗi xảy ra khi cập nhật trạng thái'));
    }
  });
}
