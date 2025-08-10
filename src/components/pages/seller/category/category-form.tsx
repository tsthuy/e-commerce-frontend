import { memo, useEffect, useMemo, useState } from 'react';

import { FileText, Package, Tag, X } from 'lucide-react';
import { z } from 'zod';

import type { CategoryRequest, CategoryResponse, DataForm } from '~/types';

import { useCategoryCreate, useCategoryUpdate, useCloudinaryUpload, useCustomForm, useTranslation } from '~/hooks';

import { validates } from '~/utils';

import { Button } from '~/components/common';
import { CustomForm, CustomInput } from '~/components/form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryResponse | null;
}

export const CategoryForm = memo<CategoryFormProps>(({ isOpen, onClose, category }) => {
  const { t } = useTranslation();
  const isEdit = !!category;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const createMutation = useCategoryCreate();
  const updateMutation = useCategoryUpdate();
  const { uploadFile, isUploading } = useCloudinaryUpload({ folder: 'categories' });

  const isLoading = createMutation.isPending || updateMutation.isPending || isUploading;

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, {
          message: validates.required.message('Category name')
        }),
        slug: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional()
      }),
    []
  );

  const defaultValues = useMemo(
    () => ({
      name: '',
      slug: '',
      description: '',
      imageUrl: ''
    }),
    []
  );

  const { form } = useCustomForm(schema, { defaultValues });
  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.setValue('name', category.name);
        form.setValue('slug', category.slug || '');
        form.setValue('description', category.description || '');
        form.setValue('imageUrl', category.imageUrl || '');
        setImagePreview(category.imageUrl || '');
        setImageFile(null);
      } else {
        form.reset(defaultValues);
        setImagePreview('');
        setImageFile(null);
      }
    }
  }, [isOpen, category, form, defaultValues]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = (): void => {
    setImageFile(null);
    setImagePreview('');
    form.setValue('imageUrl', '');
  };

  const handleSubmit = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    try {
      const { name, slug, description } = values;
      let imageUrl = values.imageUrl;
      if (imageFile) {
        const uploadResult = await uploadFile(imageFile);
        imageUrl = uploadResult.secure_url;
      }

      const data: CategoryRequest = {
        name,
        ...(slug && { slug }),
        ...(description && { description }),
        ...(imageUrl && { imageUrl })
      };

      if (isEdit && category) {
        await updateMutation.mutateAsync({ categoryId: category.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-[400px] overflow-hidden rounded-md sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl uppercase">{isEdit ? t('Category.editCategory') : t('Category.addNewCategory')}</DialogTitle>
        </DialogHeader>

        <div className="flex h-full max-h-[calc(90vh-180px)] flex-col">
          <CustomForm className="flex flex-col space-y-4" provider={form} onSubmit={handleSubmit}>
            <CustomInput disabled={isLoading} label={t('Category.categoryName')} name="name" placeholder={t('Category.enterCategoryName')} startIcon={Tag} />

            <CustomInput disabled={isLoading} label={t('Category.slug')} name="slug" placeholder={t('Category.enterSlug')} startIcon={Tag} />

            <CustomInput disabled={isLoading} label={t('Category.description')} name="description" placeholder={t('Category.enterDescription')} startIcon={FileText} />

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Category.categoryImage')}</label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img alt="Category preview" className="h-32 w-full rounded-md object-cover" src={imagePreview} />
                    <Button className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0" type="button" variant="destructive" onClick={handleRemoveImage}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="mt-2">
                      <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-500">
                        <span>{t('Category.selectImage')}</span>
                        <input accept="image/*" className="sr-only" disabled={isLoading} type="file" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button disabled={isLoading} type="button" variant="outline" onClick={onClose}>
                {t('Common.cancel')}
              </Button>
              <Button className="hover:bg-custom-primary-bg-hover hover:text-black" disabled={isLoading} isLoading={isLoading} type="submit">
                {isEdit ? t('Category.updateCategory') : t('Category.createCategory')}
              </Button>
            </DialogFooter>
          </CustomForm>
        </div>
      </DialogContent>
    </Dialog>
  );
});
