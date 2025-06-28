import { memo, useEffect, useMemo } from 'react';

import { FileText, Tag } from 'lucide-react';
import { z } from 'zod';

import type { CategoryRequest, CategoryResponse, DataForm } from '~/types';

import { useCategoryCreate, useCategoryUpdate, useCustomForm } from '~/hooks';

import { validates } from '~/utils';

import { Button } from '~/components/common';
import { CustomForm, CustomInput } from '~/components/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryResponse | null;
}

export const CategoryForm = memo<CategoryFormProps>(({ isOpen, onClose, category }) => {
  const isEdit = !!category;

  const createMutation = useCategoryCreate();
  const updateMutation = useCategoryUpdate();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, {
          message: validates.required.message('Category name')
        }),
        slug: z.string().optional(),
        description: z.string().optional()
      }),
    []
  );

  const defaultValues = useMemo(
    () => ({
      name: '',
      slug: '',
      description: ''
    }),
    []
  );

  const { form } = useCustomForm(schema, { defaultValues });

  // Reset form when category changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.setValue('name', category.name);
        form.setValue('slug', category.slug || '');
        form.setValue('description', category.description || '');
      } else {
        form.reset(defaultValues);
      }
    }
  }, [isOpen, category, form, defaultValues]);

  const handleSubmit = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    try {
      const { name, slug, description } = values;
      const data: CategoryRequest = {
        name,
        ...(slug && { slug }),
        ...(description && { description })
      };

      if (isEdit && category) {
        await updateMutation.mutateAsync({ categoryId: category.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Failed to save category:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-[400px] overflow-hidden rounded-md sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl uppercase">{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription className="text-center text-primary">{isEdit ? 'Update category information' : 'Create a new category for your products'}</DialogDescription>
        </DialogHeader>

        <div className="flex h-full max-h-[calc(90vh-180px)] flex-col">
          <CustomForm className="flex flex-col space-y-4" provider={form} onSubmit={handleSubmit}>
            <CustomInput disabled={isLoading} label="Category Name" name="name" placeholder="Enter category name" startIcon={Tag} />

            <CustomInput disabled={isLoading} label="Slug (Optional)" name="slug" placeholder="Enter URL-friendly slug" startIcon={Tag} />

            <CustomInput disabled={isLoading} label="Description (Optional)" name="description" placeholder="Enter category description" startIcon={FileText} />

            <DialogFooter className="pt-4">
              <Button disabled={isLoading} type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="hover:bg-custom-primary-bg-hover hover:text-black" disabled={isLoading} isLoading={isLoading} type="submit">
                {isEdit ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </CustomForm>
        </div>
      </DialogContent>
    </Dialog>
  );
});
