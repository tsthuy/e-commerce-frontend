import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiResponse, CategoryRequest, CategoryResponse } from '~/types';

import { queries } from '~/queries';

import { categoryApi } from '~/services';

import { getErrorMessage } from '~/utils';

export function useCategoryCreate(): UseMutationResult<ApiResponse<CategoryResponse>, Error, CategoryRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryRequest) => categoryApi.create({ data }).then((res) => res.data),
    onSuccess: () => {
      toast.success('Category created successfully!');
      // Invalidate and refetch category list
      queryClient.invalidateQueries({ queryKey: queries.category.list._def });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
}

export function useCategoryUpdate(): UseMutationResult<ApiResponse<CategoryResponse>, Error, { categoryId: string; data: CategoryRequest }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CategoryRequest }) => categoryApi.update({ categoryId, data }).then((res) => res.data),
    onSuccess: () => {
      toast.success('Category updated successfully!');
      // Invalidate and refetch category list
      queryClient.invalidateQueries({ queryKey: queries.category.list._def });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
}

export function useCategoryDelete(): UseMutationResult<ApiResponse<void>, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => categoryApi.delete({ categoryId }).then((res) => res.data),
    onSuccess: () => {
      toast.success('Category deleted successfully!');
      // Invalidate and refetch category list
      queryClient.invalidateQueries({ queryKey: queries.category.list._def });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
}
