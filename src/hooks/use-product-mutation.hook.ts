import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '~/constants';

import type { ProductPayload } from '~/types';

import { queries } from '~/queries';

import { productApi } from '~/services/product.api';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useProductCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductPayload) => productApi.create({ data }),
    onSuccess: () => {
      toast.success('Product created successfully');
      // Invalidate product lists to refresh data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.product.list] });
      queryClient.invalidateQueries({ queryKey: queries.product.sellerList._def });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || 'Failed to create product');
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useProductUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductPayload }) => productApi.update({ productId, data }),
    onSuccess: (_, variables) => {
      toast.success('Product updated successfully');
      // Invalidate specific product detail and lists
      queryClient.invalidateQueries({ ...queries.product.detail({ data: { productId: variables.productId } }) });
      queryClient.invalidateQueries({ queryKey: queries.product.sellerList._def });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || 'Failed to update product');
    }
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useProductDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productApi.delete({ productId }),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      // Invalidate product lists to refresh data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.product.list] });
      queryClient.invalidateQueries({ queryKey: queries.product.sellerList._def });
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || 'Failed to delete product');
    }
  });
};
