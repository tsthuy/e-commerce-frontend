import { memo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { DollarSign, FileText, Image, PackageCheck, Save } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { CLOUDINARY_FOLDERS } from '~/constants';

import type { DataForm, ProductPayload } from '~/types';

import { queries } from '~/queries';

import { useCategoryList, useCloudinaryUpload, useProductCreate } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { Button, Helmet } from '~/components/common';
import { UploadProgress } from '~/components/common/cloudinary';
import { CustomForm, CustomInput, CustomInputImage, CustomInputTextarea, CustomSelect, CustomSwitch } from '~/components/form';
import { Card } from '~/components/ui';

import { SELLER_ROUTES } from '~/routes';

export const ProductCreateForm = memo(() => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks for API operations
  const { data: categoriesResponse } = useCategoryList({
    data: { page: 0, size: 100 } // Get all categories for dropdown
  });

  const createMutation = useProductCreate();

  const queryClient = useQueryClient();

  const { uploadFile, isUploading, progress } = useCloudinaryUpload({
    folder: CLOUDINARY_FOLDERS.PRODUCTS
  });

  const categories = categoriesResponse?.result?.content || [];

  const schema = z.object({
    name: z.string().min(1, validates.required.message('Product name')),
    sku: z.string().min(1, validates.required.message('SKU')),
    description: z.string().min(1, validates.required.message('Description')),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    salePrice: z.coerce.number().min(0).optional().or(z.literal('')),
    costPrice: z.coerce.number().min(0).optional().or(z.literal('')),
    stock: z.coerce.number().min(0, 'Stock quantity is required and must be 0 or positive').int(),
    categoryId: z.string().min(1, validates.required.message('Category')),
    status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
    isPublished: z.boolean(),
    images: z.array(z.instanceof(File)).optional()
  });

  const defaultValues = {
    name: '',
    sku: '',
    description: '',
    price: 0,
    salePrice: '' as const,
    costPrice: '' as const,
    stock: 0,
    categoryId: '',
    status: 'DRAFT' as const,
    isPublished: false,
    images: [] as File[]
  };

  // Handle form submission
  const handleSubmit = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading || isUploading) return;

    setIsLoading(true);
    try {
      // Upload images first
      const uploadedImages = [];

      // Upload new images
      if (values.images && values.images.length > 0) {
        for (const file of values.images) {
          // eslint-disable-next-line no-await-in-loop
          const response = await uploadFile(file);
          uploadedImages.push({
            url: response.secure_url,
            publicId: response.public_id,
            isDefault: uploadedImages.length === 0 // First image is default
          });
        }
      }

      // Prepare payload
      const payload: ProductPayload = {
        name: values.name,
        sku: values.sku,
        description: values.description,
        price: values.price,
        salePrice: values.salePrice || undefined,
        costPrice: values.costPrice || undefined,
        stock: values.stock,
        categoryId: values.categoryId,
        status: values.status,
        isPublished: values.isPublished,
        images: uploadedImages
      };

      await createMutation.mutateAsync(payload);
      toast.success('Product created successfully');

      history.push(SELLER_ROUTES.allProducts.path());
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: queries.product.sellerList._def });
    }
  };

  return (
    <Helmet title="Create Product">
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Create Product</h1>

        <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Basic Info Section */}
            <div className="lg:col-span-2">
              <Card className="mb-6 p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <FileText className="mr-2 h-5 w-5" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <CustomInput isRequired disabled={isLoading} label="Product Name" name="name" placeholder="Enter product name" />
                  </div>

                  <CustomInput isRequired disabled={isLoading} label="SKU" name="sku" placeholder="E.g., TS-MEN-001" />

                  <CustomSelect
                    isRequired
                    disabled={isLoading}
                    label="Category"
                    name="categoryId"
                    placeholder="Select category"
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat.id
                    }))}
                  />

                  <div className="md:col-span-2">
                    <CustomInputTextarea isRequired disabled={isLoading} label="Description" name="description" placeholder="Describe your product" rows={4} />
                  </div>
                </div>
              </Card>

              <Card className="mb-6 p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Pricing & Inventory
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <CustomInput isRequired disabled={isLoading} label="Price" name="price" placeholder="0.00" startIcon={DollarSign} type="number" />

                  <CustomInput disabled={isLoading} label="Sale Price" name="salePrice" placeholder="0.00" startIcon={DollarSign} type="number" />

                  <CustomInput disabled={isLoading} label="Cost Price" name="costPrice" placeholder="0.00" startIcon={DollarSign} type="number" />

                  <CustomInput isRequired disabled={isLoading} label="Stock Quantity" name="stock" placeholder="0" startIcon={PackageCheck} type="number" />

                  <CustomSelect
                    isRequired
                    disabled={isLoading}
                    label="Status"
                    name="status"
                    options={[
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Inactive', value: 'INACTIVE' },
                      { label: 'Draft', value: 'DRAFT' }
                    ]}
                  />

                  <div className="flex items-center pt-8">
                    <CustomSwitch disabled={isLoading} label="Published" name="isPublished" />
                  </div>
                </div>
              </Card>

              <Card className="mb-6 p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <Image className="mr-2 h-5 w-5" />
                  Product Images
                </h2>

                <CustomInputImage multiple disabled={isLoading} label="Product Images" name="images" />

                <UploadProgress isUploading={isUploading} mode="multiple" progress={progress} />
              </Card>
            </div>

            {/* Actions */}
            <div>
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Actions</h2>

                <div className="flex flex-col gap-3">
                  <Button className="w-full" disabled={isLoading || isUploading} isLoading={isLoading || isUploading} type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Create Product
                  </Button>

                  <Button className="w-full" type="button" variant="outline" onClick={() => history.push(SELLER_ROUTES.allProducts.path())}>
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </CustomForm>
      </div>
    </Helmet>
  );
});
