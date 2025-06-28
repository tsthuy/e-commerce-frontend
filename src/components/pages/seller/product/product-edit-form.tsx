import { memo, useEffect, useMemo, useState } from 'react';

import { AlertCircle, CheckCircle2, Copy, DollarSign, Eye, EyeOff, FileText, Image, Layers, PackageCheck, Plus, Save, Tag, Trash2 } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { CLOUDINARY_FOLDERS } from '~/constants';

import type { AttributeValue, DataForm, ProductAttribute, ProductImage, ProductPayload, ProductVariant, VariantAttributeValue } from '~/types';

import { useCategoryList, useCloudinaryUpload, useProductDetail, useProductUpdate } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { Button, Helmet } from '~/components/common';
import { UploadProgress } from '~/components/common/cloudinary';
import { CustomForm, CustomInput, CustomInputImage, CustomInputTextarea, CustomSelect, CustomSwitch } from '~/components/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card } from '~/components/ui';

export const ProductEditForm = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showVariantOverview, setShowVariantOverview] = useState<boolean>(false);
  const [bulkEditPrice, setBulkEditPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

  const { data: productDetail, isLoading: isLoadingDetail } = useProductDetail({
    productId: id,
    enabled: !!id
  });

  const { data: categoriesResponse } = useCategoryList({
    data: { page: 0, size: 100 }
  });

  const updateMutation = useProductUpdate();

  const { uploadFile, deleteUploadedImage, isUploading, progress } = useCloudinaryUpload({
    folder: CLOUDINARY_FOLDERS.PRODUCTS
  });

  const categories = categoriesResponse?.result?.content || [];

  useEffect(() => {
    if (productDetail) {
      // Load existing images
      if (productDetail.images) {
        setExistingImages(
          productDetail.images.map((img) => ({
            url: img.url,
            publicId: img.publicId || '',
            isDefault: img.isDefault
          }))
        );
      }

      if (productDetail.attributes) {
        setAttributes(
          productDetail.attributes.map((attr) => ({
            name: attr.name,
            values: attr.values.map((val) => ({
              label: val.label,
              value: val.value || val.label
            }))
          }))
        );
      }

      if (productDetail.variants) {
        setVariants(
          productDetail.variants.map((variant) => ({
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            stock: variant.stock,
            attributeValues: variant.attributes.map((attr) => ({
              attributeName: attr.attributeName,
              attributeValueLabel: attr.attributeValueLabel
            })),
            images: variant.images || []
          }))
        );
      }
    }
  }, [productDetail]);

  const schema = useMemo(
    () =>
      z.object({
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
        images: z.array(z.instanceof(File)).optional(),
        attributes: z
          .array(
            z.object({
              name: z.string().min(1, 'Attribute name is required'),
              values: z
                .array(
                  z.object({
                    label: z.string().min(1, 'Value label is required'),
                    value: z.string().optional()
                  })
                )
                .min(1, 'At least one value is required')
            })
          )
          .optional(),
        variants: z
          .array(
            z.object({
              sku: z.string().min(1, 'Variant SKU is required'),
              price: z.coerce.number().min(0.01, 'Variant price must be greater than 0'),
              salePrice: z.coerce.number().min(0).optional().or(z.literal('')),
              stock: z.coerce.number().min(0, 'Stock quantity is required and must be 0 or positive').int(),
              attributeValues: z.array(
                z.object({
                  attributeName: z.string(),
                  attributeValueLabel: z.string()
                })
              ),
              images: z
                .array(
                  z.object({
                    url: z.string(),
                    publicId: z.string().optional(),
                    isDefault: z.boolean().optional()
                  })
                )
                .optional()
            })
          )
          .optional()
      }),
    []
  );

  const defaultValues = useMemo(() => {
    if (!productDetail) {
      return {
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
        images: [] as File[],
        attributes: [],
        variants: []
      };
    }

    return {
      name: productDetail.name || '',
      sku: productDetail.sku || '',
      description: productDetail.description || '',
      price: productDetail.price || 0,
      salePrice: typeof productDetail.salePrice === 'number' && productDetail.salePrice > 0 ? productDetail.salePrice : ('' as const),
      costPrice: typeof productDetail.costPrice === 'number' && productDetail.costPrice > 0 ? productDetail.costPrice : ('' as const),
      stock: productDetail.stock || 0,
      categoryId: productDetail.categoryId || '',
      status: (productDetail.status || 'DRAFT') as 'ACTIVE' | 'INACTIVE' | 'DRAFT',
      isPublished: productDetail.isPublished ?? false,
      images: [] as File[],
      attributes: attributes,
      variants: variants
    };
  }, [productDetail, attributes, variants]);

  // Add new attribute với auto focus
  const handleAddAttribute = (): void => {
    setAttributes([...attributes, { name: '', values: [{ label: '', value: '' }] }]);
  };

  // Remove attribute và auto regenerate variants
  const handleRemoveAttribute = (index: number): void => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
    setTimeout(() => autoGenerateVariants(), 100);
  };

  // Update attribute name và auto regenerate variants
  const handleAttributeNameChange = (index: number, name: string): void => {
    const newAttributes = [...attributes];
    newAttributes[index].name = name;
    setAttributes(newAttributes);
    if (name.trim() !== '') {
      setTimeout(() => autoGenerateVariants(), 100);
    }
  };

  // Add value to attribute với auto focus và auto regenerate
  const handleAddAttributeValue = (attrIndex: number): void => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].values.push({ label: '', value: '' });
    setAttributes(newAttributes);
  };

  // Auto add new value khi user nhấn Enter
  const handleAttributeValueKeyDown = (attrIndex: number, valueIndex: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentValue = attributes[attrIndex].values[valueIndex].label.trim();

      if (currentValue !== '' && valueIndex === attributes[attrIndex].values.length - 1) {
        handleAddAttributeValue(attrIndex);
        setTimeout(() => {
          const nextInput = document.querySelector(`input[data-attr="${attrIndex}"][data-value="${valueIndex + 1}"]`) as HTMLInputElement;
          nextInput?.focus();
        }, 100);
      } else {
        const nextInput = document.querySelector(`input[data-attr="${attrIndex}"][data-value="${valueIndex + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  // Remove value from attribute và auto regenerate
  const handleRemoveAttributeValue = (attrIndex: number, valueIndex: number): void => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].values.splice(valueIndex, 1);
    setAttributes(newAttributes);
    setTimeout(() => autoGenerateVariants(), 100);
  };

  // Update attribute value và auto regenerate variants
  const handleAttributeValueChange = (attrIndex: number, valueIndex: number, field: keyof AttributeValue, value: string): void => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].values[valueIndex][field] = value;
    setAttributes(newAttributes);

    if (field === 'label' && value.trim() !== '') {
      setTimeout(() => autoGenerateVariants(), 300);
    }
  };

  // Auto generate variants khi attributes thay đổi
  const autoGenerateVariants = (): void => {
    const validAttributes = attributes.filter((attr) => attr.name.trim() !== '' && attr.values.length > 0 && attr.values.every((v) => v.label.trim() !== ''));

    if (validAttributes.length === 0) {
      setVariants([]);
      return;
    }

    const generateCombinations = (attrs: ProductAttribute[], currentIndex: number, currentCombination: VariantAttributeValue[] = []): VariantAttributeValue[][] => {
      if (currentIndex >= attrs.length) {
        return [currentCombination];
      }

      const attribute = attrs[currentIndex];
      const combinations: VariantAttributeValue[][] = [];

      attribute.values.forEach((value) => {
        const newCombination = [...currentCombination, { attributeName: attribute.name, attributeValueLabel: value.label }];
        combinations.push(...generateCombinations(attrs, currentIndex + 1, newCombination));
      });

      return combinations;
    };

    const combinations = generateCombinations(validAttributes, 0);
    const baseSku = defaultValues.sku;

    const newVariants = combinations.map((combination) => {
      const skuSuffix = combination.map((attr) => attr.attributeValueLabel.toUpperCase().replace(/\s+/g, '').substring(0, 3)).join('-');

      const existingVariant = variants.find(
        (v) =>
          v.attributeValues.length === combination.length &&
          v.attributeValues.every((attr) => combination.some((c) => c.attributeName === attr.attributeName && c.attributeValueLabel === attr.attributeValueLabel))
      );

      return (
        existingVariant || {
          sku: `${baseSku}-${skuSuffix}`,
          price: defaultValues.price,
          salePrice: typeof defaultValues.salePrice === 'number' ? defaultValues.salePrice : undefined,
          stock: Math.floor(defaultValues.stock / combinations.length) || 0,
          attributeValues: combination,
          images: []
        }
      );
    });

    setVariants(newVariants);
  };

  // Handle variant field updates
  const handleVariantUpdate = (variantIndex: number, field: string, value: string | number): void => {
    const newVariants = [...variants];

    switch (field) {
      case 'sku':
        newVariants[variantIndex].sku = value as string;
        break;
      case 'price':
        newVariants[variantIndex].price = Number(value) || 0;
        break;
      case 'salePrice':
        newVariants[variantIndex].salePrice = value ? Number(value) : undefined;
        break;
      case 'stock':
        newVariants[variantIndex].stock = Number(value) || 0;
        break;
      default:
        break;
    }

    setVariants(newVariants);
  };

  // Bulk update all variants pricing
  const handleBulkUpdatePrice = (): void => {
    const price = parseFloat(bulkEditPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const newVariants = variants.map((variant) => ({
      ...variant,
      price: price
    }));

    setVariants(newVariants);
    setBulkEditPrice('');
    toast.success(`Updated pricing for ${variants.length} variants`);
  };

  // Handle delete basic product image
  const handleDeleteImage = async (imageIndex: number): Promise<void> => {
    const imageToDelete = existingImages[imageIndex];
    if (!imageToDelete) return;

    try {
      const wasDefault = imageToDelete.isDefault;

      // Delete image from Cloudinary if it has a publicId
      if (imageToDelete.publicId) {
        await deleteUploadedImage(imageToDelete.publicId);
      }

      // Remove image from existingImages
      const newImages = existingImages.filter((_, index) => index !== imageIndex);

      // If deleted image was default and there are other images, set a new default
      if (wasDefault && newImages.length > 0) {
        newImages[0].isDefault = true;
      }

      setExistingImages(newImages);
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
      console.error(error);
    }
  };

  // Handle set default image for basic product
  const handleSetDefaultImage = (imageIndex: number): void => {
    const newImages = existingImages.map((img, index) => ({
      ...img,
      isDefault: index === imageIndex
    }));

    setExistingImages(newImages);
    toast.success('Default image updated');
  };

  // Handle delete variant image
  const handleDeleteVariantImage = async (variantIndex: number, imageIndex: number): Promise<void> => {
    const newVariants = [...variants];
    const image = newVariants[variantIndex].images?.[imageIndex];

    if (!image) return;

    try {
      const isDefault = image.isDefault;

      // Delete image from Cloudinary if it has a publicId
      if (image.publicId) {
        await deleteUploadedImage(image.publicId);
      }

      // Remove image from variant
      if (newVariants[variantIndex].images) {
        newVariants[variantIndex].images.splice(imageIndex, 1);

        // If deleted image was default and there are other images, set a new default
        if (isDefault && newVariants[variantIndex].images.length > 0) {
          newVariants[variantIndex].images[0].isDefault = true;
        }
      }

      setVariants(newVariants);
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
      console.error(error);
    }
  };

  // Handle set default image for variant
  const handleSetVariantDefaultImage = (variantIndex: number, imageIndex: number): void => {
    const newVariants = [...variants];

    if (!newVariants[variantIndex].images || !newVariants[variantIndex].images.length) return;

    // Reset all images to non-default
    newVariants[variantIndex].images.forEach((img) => {
      img.isDefault = false;
    });

    // Set the selected image as default
    newVariants[variantIndex].images[imageIndex].isDefault = true;

    setVariants(newVariants);
    toast.success('Default image updated');
  };

  // Copy variant data to clipboard
  const handleCopyVariant = (variant: ProductVariant): void => {
    const variantData = {
      sku: variant.sku,
      price: variant.price,
      salePrice: variant.salePrice,
      stock: variant.stock,
      attributes: variant.attributeValues.map((av) => av.attributeValueLabel).join(' / '),
      images: variant.images?.map((img) => ({ url: img.url, publicId: img.publicId })) || [],
      imagesCount: variant.images?.length || 0,
      validationErrors: validateVariant(variant)
    };

    navigator.clipboard
      .writeText(JSON.stringify(variantData, null, 2))
      .then(() => {
        toast.success('Variant data copied to clipboard');
      })
      .catch(() => toast.error('Failed to copy variant data'));
  };

  // Generate variants khi user click button
  const generateVariants = (): void => {
    const validAttributes = attributes.filter((attr) => attr.name.trim() !== '' && attr.values.length > 0 && attr.values.every((v) => v.label.trim() !== ''));

    if (validAttributes.length === 0) {
      toast.error('Add at least one attribute with values to generate variants');
      return;
    }

    autoGenerateVariants();
    toast.success(`Generated ${variants.length} variants successfully!`);
  };

  // Validate variant data
  const validateVariant = (variant: ProductVariant): string[] => {
    const errors: string[] = [];

    if (!variant.sku || variant.sku.trim() === '') {
      errors.push('SKU is required');
    }

    if (!variant.price || variant.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (variant.salePrice && variant.salePrice >= variant.price) {
      errors.push('Sale price must be less than regular price');
    }

    if (variant.stock === undefined || variant.stock < 0) {
      errors.push('Stock quantity is required and cannot be negative');
    }

    if (!variant.images || variant.images.length === 0) {
      errors.push('At least one image is required');
    } else {
      const validImages = variant.images.filter((img) => img.url && img.url.trim() !== '');
      if (validImages.length === 0) {
        errors.push('At least one valid image is required');
      }
    }

    return errors;
  };

  // Handle variant image upload
  const handleVariantImageUpload = async (variantIndex: number, files: File[]): Promise<void> => {
    if (files.length === 0) return;

    try {
      toast.success(`Uploading ${files.length} image(s) for variant...`);

      const uploadPromises = files.map((file) => uploadFile(file));
      const responses = await Promise.all(uploadPromises);

      const newImages = responses.map((response) => ({
        url: response.secure_url,
        publicId: response.public_id,
        isDefault: false
      }));

      const newVariants = [...variants];

      if (!newVariants[variantIndex].images) {
        newVariants[variantIndex].images = [];
      }

      newVariants[variantIndex].images!.push(...newImages);

      if (newVariants[variantIndex].images!.length > 0 && !newVariants[variantIndex].images!.some((img) => img.isDefault)) {
        newVariants[variantIndex].images![0].isDefault = true;
      }

      setVariants(newVariants);
      toast.success(`Successfully uploaded ${files.length} image(s)`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload variant image(s)');
    }
  };

  // Handle form submission
  const handleSubmit = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading || isUploading) return;

    setIsLoading(true);
    try {
      // Upload main product images first
      const uploadedImages: ProductImage[] = [];

      // Keep existing images
      if (existingImages && existingImages.length > 0) {
        uploadedImages.push(
          ...existingImages.map((img) => ({
            url: img.url,
            publicId: img.publicId || '',
            isDefault: img.isDefault
          }))
        );
      }

      // Upload new images
      if (values.images && values.images.length > 0) {
        for (const file of values.images) {
          // eslint-disable-next-line no-await-in-loop
          const response = await uploadFile(file);
          uploadedImages.push({
            url: response.secure_url,
            publicId: response.public_id,
            isDefault: uploadedImages.length === 0
          });
        }
      }

      // Validate và prepare attributes/variants
      const validAttributes = attributes.filter((attr) => attr.name.trim() !== '' && attr.values.length > 0 && attr.values.every((v) => v.label.trim() !== ''));
      const validVariants = variants.filter((variant) => variant.attributeValues.length > 0 && variant.sku.trim() !== '');

      if (validAttributes.length > 0 && validVariants.length === 0) {
        toast.error('Please generate variants for your attributes or remove attributes');
        setIsLoading(false);
        return;
      }

      if (validVariants.length > 0) {
        const variantErrors: string[] = [];

        validVariants.forEach((variant) => {
          const errors = validateVariant(variant);
          if (errors.length > 0) {
            const variantLabel = variant.attributeValues.map((av) => av.attributeValueLabel).join(' / ');
            variantErrors.push(`Variant "${variantLabel}": ${errors.join(', ')}`);
          }
        });

        if (variantErrors.length > 0) {
          toast.error(`Please fix variant issues:\n${variantErrors.slice(0, 3).join('\n')}${variantErrors.length > 3 ? `\n...and ${variantErrors.length - 3} more` : ''}`);
          setIsLoading(false);
          return;
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
        images: uploadedImages.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          isDefault: img.isDefault
        }))
      };

      // Include attributes và variants khi có data
      if (validAttributes.length > 0) {
        payload.attributes = validAttributes.map((attr) => ({
          name: attr.name,
          values: attr.values.map((val) => ({
            label: val.label,
            value: val.value || val.label.toLowerCase().replace(/\s+/g, '_')
          }))
        }));

        // Validate and filter variant data
        const validatedVariants = validVariants.filter((variant) => {
          const hasValidAttributes = variant.attributeValues.every(
            (attrVal) => attrVal.attributeName && attrVal.attributeValueLabel && attrVal.attributeName.trim() !== '' && attrVal.attributeValueLabel.trim() !== ''
          );

          if (!hasValidAttributes) {
            toast.error(`Variant ${variant.sku} has invalid attribute data`);
            return false;
          }

          return true;
        });

        if (validatedVariants.length !== validVariants.length) {
          setIsLoading(false);
          return;
        }

        payload.variants = validatedVariants.map((variant) => ({
          sku: variant.sku,
          price: variant.price,
          salePrice: variant.salePrice || undefined,
          stock: variant.stock,
          attributeValues: variant.attributeValues.map((attrVal) => ({
            attributeName: attrVal.attributeName,
            attributeValueLabel: attrVal.attributeValueLabel
          })),
          images:
            variant.images?.map((img) => ({
              url: img.url,
              publicId: img.publicId,
              isDefault: img.isDefault
            })) || []
        }));
      }

      await updateMutation.mutateAsync({ productId: id, data: payload });
      toast.success('Product updated successfully');

      // Navigate back to products list after delay
      setTimeout(() => history.push('/seller/products'), 1000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingDetail) {
    return (
      <Helmet title="Edit Product">
        <div className="p-6">
          <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </div>
      </Helmet>
    );
  }

  if (!productDetail) {
    return (
      <Helmet title="Edit Product">
        <div className="p-6">
          <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Product not found</p>
            <Button className="mt-4" onClick={() => history.push('/seller/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </Helmet>
    );
  }

  return (
    <Helmet title="Edit Product">
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>

        <CustomForm key={productDetail.id} options={{ defaultValues }} schema={schema} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
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

                {/* Display existing images */}
                {existingImages && existingImages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-medium">Current Images:</h3>
                    <div className="flex flex-wrap gap-3">
                      {existingImages.map((img, idx) => (
                        <div key={img.publicId || idx} className="relative h-24 w-24 overflow-hidden rounded-md border">
                          <img alt={`Product ${idx + 1}`} className="h-full w-full object-cover" src={img.url} />

                          {/* Overlay with action buttons */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
                            <div className="flex gap-1">
                              <Button className="h-6 w-6" size="icon" type="button" variant="destructive" onClick={() => handleDeleteImage(idx)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>

                              <Button className="h-6 w-6" size="icon" type="button" variant={img.isDefault ? 'default' : 'outline'} onClick={() => handleSetDefaultImage(idx)}>
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Default indicator */}
                          {img.isDefault && <div className="absolute bottom-0 left-0 right-0 bg-green-500 py-0.5 text-center text-xs text-white">Default</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Attributes and Variants */}
            <div>
              <Card className="mt-6 p-6">
                <div className="w-full">
                  <div className="mt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-medium">Product Attributes</h3>
                      <div className="text-sm text-muted-foreground">{attributes.length > 0 && `${attributes.length} attribute(s) • Auto-generates ${variants.length} variant(s)`}</div>
                    </div>

                    {attributes.map((attr, index) => (
                      <div key={index} className="mb-4 rounded-lg border border-border bg-card p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <input
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Attribute name (e.g., Color, Size, Material)"
                            type="text"
                            value={attr.name}
                            onChange={(e) => handleAttributeNameChange(index, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && attr.name.trim() !== '') {
                                e.preventDefault();
                                const firstValueInput = document.querySelector(`input[data-attr="${index}"][data-value="0"]`) as HTMLInputElement;
                                firstValueInput?.focus();
                              }
                            }}
                          />

                          <Button size="icon" type="button" variant="ghost" onClick={() => handleRemoveAttribute(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3">
                          <h4 className="mb-3 text-sm font-medium text-muted-foreground">Values ({attr.values.length}):</h4>

                          <div className="grid gap-2">
                            {attr.values.map((val, valIndex) => (
                              <div key={valIndex} className="flex items-center gap-2">
                                <input
                                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  data-attr={index}
                                  data-value={valIndex}
                                  placeholder="Label (e.g., Red, Large, Cotton)"
                                  type="text"
                                  value={val.label}
                                  onChange={(e) => handleAttributeValueChange(index, valIndex, 'label', e.target.value)}
                                  onKeyDown={(e) => handleAttributeValueKeyDown(index, valIndex, e)}
                                />

                                <input
                                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  placeholder="Value (e.g., #FF0000, XL, cotton)"
                                  type="text"
                                  value={val.value}
                                  onChange={(e) => handleAttributeValueChange(index, valIndex, 'value', e.target.value)}
                                />

                                <Button disabled={attr.values.length <= 1} size="icon" type="button" variant="ghost" onClick={() => handleRemoveAttributeValue(index, valIndex)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <Button className="mt-3 w-full" size="sm" type="button" variant="outline" onClick={() => handleAddAttributeValue(index)}>
                            <Plus className="mr-1 h-3 w-3" />
                            Add Value
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Button className="w-full" type="button" variant="outline" onClick={handleAddAttribute}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Attribute
                      </Button>

                      {attributes.length > 0 && (
                        <div className="rounded-lg border border-dashed bg-muted/50 p-4 text-center">
                          <div className="mb-2 text-sm text-muted-foreground">
                            Variants will be auto-generated when you add attribute values.
                            <br />
                            Press <kbd className="rounded bg-muted px-1 py-0.5 text-xs">Enter</kbd> to quickly add values.
                          </div>
                          <Button size="sm" type="button" onClick={generateVariants}>
                            <Layers className="mr-2 h-3 w-3" />
                            Regenerate Variants ({variants.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-medium">Product Variants ({variants.length})</h3>

                      {variants.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" type="button" variant="outline" onClick={() => setShowVariantOverview(!showVariantOverview)}>
                            {showVariantOverview ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                            {showVariantOverview ? 'Hide Overview' : 'Show Overview'}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Bulk Actions */}
                    {variants.length > 1 && (
                      <div className="mb-4 rounded-lg border border-dashed bg-muted/50 p-4">
                        <h4 className="mb-3 text-sm font-medium">Bulk Actions</h4>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              placeholder="Update all variant prices"
                              step="0.01"
                              type="number"
                              value={bulkEditPrice}
                              onChange={(e) => setBulkEditPrice(e.target.value)}
                            />
                          </div>
                          <Button size="sm" type="button" onClick={handleBulkUpdatePrice}>
                            Update All
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Variant Overview Table */}
                    {showVariantOverview && variants.length > 0 && (
                      <div className="mb-4 overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="border-b p-2 text-left">Variant</th>
                              <th className="border-b p-2 text-left">SKU</th>
                              <th className="border-b p-2 text-left">Price</th>
                              <th className="border-b p-2 text-left">Stock</th>
                              <th className="border-b p-2 text-left">Status</th>
                              <th className="border-b p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((variant, index) => {
                              const errors = validateVariant(variant);
                              const isComplete = errors.length === 0;
                              const variantLabel = variant.attributeValues.map((av) => av.attributeValueLabel).join(' / ');

                              return (
                                <tr key={index} className="hover:bg-muted/25">
                                  <td className="border-b p-2 font-medium">{variantLabel}</td>
                                  <td className="border-b p-2">{variant.sku || '-'}</td>
                                  <td className="border-b p-2">
                                    {variant.price ? `$${variant.price}` : '-'}
                                    {variant.salePrice && ` (Sale: $${variant.salePrice})`}
                                  </td>
                                  <td className="border-b p-2">{variant.stock || 0}</td>
                                  <td className="border-b p-2">
                                    <div className="flex items-center gap-1">
                                      {isComplete ? (
                                        <>
                                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                                          <span className="text-green-600">Complete</span>
                                        </>
                                      ) : (
                                        <>
                                          <AlertCircle className="h-3 w-3 text-red-500" />
                                          <span className="text-red-600">{errors.length} issue(s)</span>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                  <td className="border-b p-2">
                                    <Button size="sm" type="button" variant="ghost" onClick={() => handleCopyVariant(variant)}>
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {variants.length > 0 ? (
                      <Accordion className="w-full" type="multiple">
                        {variants.map((variant, index) => {
                          const errors = validateVariant(variant);
                          const isComplete = errors.length === 0;
                          const variantLabel = variant.attributeValues.map((av) => av.attributeValueLabel).join(' / ');

                          return (
                            <AccordionItem key={index} value={`variant-${index}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {isComplete ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                                    <span className="font-medium">{variantLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {variant.price && <span>${variant.price}</span>}
                                    {variant.stock !== undefined && <span>• {variant.stock} in stock</span>}
                                    {!isComplete && <span>• {errors.length} issue(s)</span>}
                                  </div>
                                </div>
                              </AccordionTrigger>

                              <AccordionContent>
                                {/* Show validation errors */}
                                {errors.length > 0 && (
                                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
                                    <div className="mb-2 flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                      <span className="text-sm font-medium text-red-700">Issues to fix:</span>
                                    </div>
                                    <ul className="space-y-1 text-sm text-red-600">
                                      {errors.map((error, errorIndex) => (
                                        <li key={errorIndex}>• {error}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 gap-3 p-2">
                                  <div className="grid grid-cols-1 gap-3">
                                    <div>
                                      <label className="mb-2 block text-sm font-medium" htmlFor={`variant-sku-${index}`}>
                                        SKU *
                                      </label>
                                      <input
                                        className={`w-full rounded-md border ${!variant.sku ? 'border-red-300 bg-red-50' : 'border-input bg-background'} px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                                        id={`variant-sku-${index}`}
                                        placeholder="Enter variant SKU"
                                        type="text"
                                        value={variant.sku || ''}
                                        onChange={(e) => handleVariantUpdate(index, 'sku', e.target.value)}
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="mb-2 block text-sm font-medium" htmlFor={`variant-price-${index}`}>
                                          Price *
                                        </label>
                                        <div className="relative">
                                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                          <input
                                            className={`w-full rounded-md border ${!variant.price || variant.price <= 0 ? 'border-red-300 bg-red-50' : 'border-input bg-background'} py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                                            id={`variant-price-${index}`}
                                            placeholder="0.00"
                                            step="0.01"
                                            type="number"
                                            value={variant.price || ''}
                                            onChange={(e) => handleVariantUpdate(index, 'price', e.target.value)}
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="mb-2 block text-sm font-medium" htmlFor={`variant-sale-price-${index}`}>
                                          Sale Price (Optional)
                                        </label>
                                        <div className="relative">
                                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                          <input
                                            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            id={`variant-sale-price-${index}`}
                                            placeholder="0.00"
                                            step="0.01"
                                            type="number"
                                            value={variant.salePrice || ''}
                                            onChange={(e) => handleVariantUpdate(index, 'salePrice', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-sm font-medium" htmlFor={`variant-stock-${index}`}>
                                        Stock Quantity *
                                      </label>
                                      <div className="relative">
                                        <PackageCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                          className={`w-full rounded-md border ${variant.stock === undefined || variant.stock < 0 ? 'border-red-300 bg-red-50' : 'border-input bg-background'} py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                                          id={`variant-stock-${index}`}
                                          min="0"
                                          placeholder="0"
                                          type="number"
                                          value={variant.stock !== undefined ? variant.stock : ''}
                                          onChange={(e) => handleVariantUpdate(index, 'stock', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                      <span>Variant Images *</span>
                                      {(!variant.images || variant.images.length === 0) && <span className="text-xs text-red-500">(At least 1 required)</span>}
                                      {variant.images && variant.images.length > 0 && <span className="text-xs text-green-600">({variant.images.length} uploaded)</span>}
                                    </div>

                                    {/* Direct file input for variants */}
                                    <div className="relative">
                                      <input
                                        multiple
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={isLoading || isUploading}
                                        type="file"
                                        onChange={(e) => {
                                          const files = e.target.files;
                                          if (files && files.length > 0) {
                                            handleVariantImageUpload(index, Array.from(files));
                                            // Reset input after upload
                                            e.target.value = '';
                                          }
                                        }}
                                      />
                                      <p className="mt-1 text-xs text-muted-foreground">Upload JPG, PNG, or WebP images</p>
                                    </div>

                                    {variant.images && variant.images.length > 0 ? (
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {variant.images.map((img, imgIndex) => (
                                          <div key={imgIndex} className="relative h-16 w-16 overflow-hidden rounded-md border">
                                            <img alt={`Variant ${imgIndex + 1}`} className="h-full w-full object-cover" src={img.url} />

                                            {/* Overlay with action buttons */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
                                              <div className="flex gap-1">
                                                <Button className="h-5 w-5" size="icon" type="button" variant="destructive" onClick={() => handleDeleteVariantImage(index, imgIndex)}>
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>

                                                <Button
                                                  className="h-5 w-5"
                                                  size="icon"
                                                  type="button"
                                                  variant={img.isDefault ? 'default' : 'outline'}
                                                  onClick={() => handleSetVariantDefaultImage(index, imgIndex)}
                                                >
                                                  <CheckCircle2 className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>

                                            {/* Default indicator */}
                                            {img.isDefault && <div className="absolute bottom-0 left-0 right-0 bg-green-500 py-0.5 text-center text-xs text-white">Default</div>}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="mt-3 rounded-md border border-dashed border-red-300 bg-red-50 p-4 text-center">
                                        <Image className="mx-auto mb-2 h-6 w-6 text-red-400" />
                                        <p className="text-sm text-red-600">No images uploaded yet</p>
                                        <p className="text-xs text-red-500">Please upload at least one image for this variant</p>
                                      </div>
                                    )}

                                    {/* Action buttons for each variant */}
                                    <div className="mt-4 flex items-center gap-2">
                                      <Button size="sm" type="button" variant="outline" onClick={() => handleCopyVariant(variant)}>
                                        <Copy className="mr-1 h-3 w-3" />
                                        Copy Data
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    ) : (
                      <div className="rounded-md border border-dashed p-6 text-center">
                        <Layers className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p>No variants yet.</p>
                        <p className="mt-1 text-sm text-muted-foreground">Add attributes and generate variants first.</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <Tag className="mr-2 h-5 w-5" />
                  Actions
                </h2>

                <div className="flex flex-col gap-3">
                  <Button className="w-full" disabled={isLoading || isUploading} isLoading={isLoading || isUploading} type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Update Product
                  </Button>

                  <Button className="w-full" type="button" variant="outline" onClick={() => history.push('/seller/products')}>
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
