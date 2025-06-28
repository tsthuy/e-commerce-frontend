import { memo, useEffect, useState } from 'react';

import axios from 'axios';
import { AlertCircle, AlertTriangle, ArrowLeft, Calendar, Copy, Image, Info, Layers, Package, PackageCheck, Pencil, Star } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { API_URLS } from '~/constants';

import type { Product as BaseProduct, ProductVariant } from '~/types';

import { getErrorMessage } from '~/utils';

import { Button, Helmet } from '~/components/common';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Card, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui';

interface Product extends BaseProduct {
  isNew?: boolean;
  category?: { id: string; name: string };
  averageRating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  meta?: Record<string, unknown>;
}

export const ProductView = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVariants, setExpandedVariants] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/${API_URLS.product.detail(id)}`);
        setProduct(response.data.result);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(`Failed to load product: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCopyProductData = (): void => {
    if (!product) return;

    navigator.clipboard
      .writeText(JSON.stringify(product, null, 2))
      .then(() => toast.success('Product data copied to clipboard'))
      .catch(() => toast.error('Failed to copy product data'));
  };

  // Helper function to get stock level indicator
  const getStockIndicator = (stockLevel: number): { label: string; color: string; icon: JSX.Element } => {
    if (stockLevel <= 5) {
      return {
        label: 'Low Stock',
        color: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="mr-1 h-4 w-4" />
      };
    } else if (stockLevel <= 20) {
      return {
        label: 'Medium Stock',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertTriangle className="mr-1 h-4 w-4" />
      };
    } else {
      return {
        label: 'In Stock',
        color: 'bg-green-100 text-green-800',
        icon: <PackageCheck className="mr-1 h-4 w-4" />
      };
    }
  };

  if (loading) {
    return (
      <Helmet title="Loading Product Details">
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2 text-lg">Loading product details...</span>
        </div>
      </Helmet>
    );
  }

  if (error || !product) {
    return (
      <Helmet title="Product Not Found">
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <p className="text-lg text-red-600">Failed to load product: {error}</p>
          <Button className="mt-4" onClick={() => history.goBack()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Helmet>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-yellow-100 text-yellow-800',
    DRAFT: 'bg-gray-100 text-gray-800'
  };

  const stockIndicator = getStockIndicator(product.stock);
  // Check for metadata fields
  const hasMetadata = Boolean(product.createdAt || product.updatedAt || product.meta);

  return (
    <Helmet title={`View Product: ${product.name}`}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className={`${statusColors[product.status]} border-none`} variant="outline">
                {product.status}
              </Badge>
              {product.isNew && <Badge className="bg-blue-100 text-blue-800">New</Badge>}
              {product.isPublished ? (
                <Badge className="bg-green-100 text-green-800">Published</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800" variant="outline">
                  Not Published
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => history.goBack()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={handleCopyProductData}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Data
            </Button>
            <Button onClick={() => history.push(`/seller/edit-product/${id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-6 p-6">
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <Package className="mr-2 h-5 w-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="text-base font-medium">{product.sku}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Category</p>
                  <p className="text-base font-medium">{product.category?.name || 'No category'}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Price</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium">${product.price.toFixed(2)}</p>
                    {product.salePrice && product.salePrice > 0 && <p className="text-sm text-muted-foreground line-through">${product.salePrice.toFixed(2)}</p>}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Stock</p>
                  <div className="flex items-center">
                    <p className="text-base font-medium">{product.stock}</p>
                    <Badge className={`ml-2 ${stockIndicator.color}`}>
                      <span className="flex items-center">
                        {stockIndicator.icon}
                        {stockIndicator.label}
                      </span>
                    </Badge>
                  </div>
                </div>

                {product.costPrice && product.costPrice > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Cost Price</p>
                    <p className="text-base font-medium">${product.costPrice.toFixed(2)}</p>
                  </div>
                )}

                {product.averageRating && product.averageRating > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Rating</p>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-base font-medium">{product.averageRating?.toFixed(1)}</span>
                      <span className="ml-1 text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                    </div>
                  </div>
                )}

                {hasMetadata && (
                  <div className="mt-2 rounded-md border p-3 md:col-span-2">
                    <p className="mb-2 text-sm font-medium">Metadata</p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {product.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {product.updatedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <Image className="mr-2 h-5 w-5" />
                Images
              </h2>

              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                      <img alt={`Product ${index + 1}`} className="h-full w-full object-cover" src={image.url} />
                      {image.isDefault && <Badge className="absolute bottom-2 right-2">Default</Badge>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No images available</p>
              )}
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="mb-4 flex items-center text-xl font-semibold">Description</h2>
              <div className="prose max-w-none rounded-md border p-4" dangerouslySetInnerHTML={{ __html: product.description }} />
            </Card>
          </div>

          <div>
            {/* Attributes & Variants Section */}
            {product.attributes && product.attributes.length > 0 && (
              <Card className="mb-6 p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <Info className="mr-2 h-5 w-5" />
                  Attributes
                </h2>

                <div className="space-y-4">
                  {product.attributes.map((attribute, index) => (
                    <div key={index} className="rounded-md border p-3">
                      <p className="font-medium">{attribute.name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {attribute.values.map((value, valueIndex) => (
                          <TooltipProvider key={valueIndex}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge className="px-2 py-1" variant="outline">
                                  {value.label}
                                </Badge>
                              </TooltipTrigger>
                              {value.value && (
                                <TooltipContent>
                                  <p>Value: {value.value}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {hasVariants && (
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-semibold">
                    <Layers className="mr-2 h-5 w-5" />
                    Variants ({product.variants?.length})
                  </h2>
                  <Button size="sm" variant="outline" onClick={() => setExpandedVariants(!expandedVariants)}>
                    {expandedVariants ? 'Collapse All' : 'Expand All'}
                  </Button>
                </div>

                <Accordion defaultValue={expandedVariants ? product.variants?.map((_, i) => `variant-${i}`) : []} type="multiple">
                  {product.variants?.map((variant: ProductVariant, index: number) => {
                    const variantStockIndicator = getStockIndicator(variant.stock);
                    return (
                      <AccordionItem key={index} value={`variant-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex flex-1 items-center justify-between">
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{variant.attributeValues.map((av) => av.attributeValueLabel).join(' / ')}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>SKU: {variant.sku}</span>
                                <span>•</span>
                                <span>${variant.price.toFixed(2)}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <span>Stock: {variant.stock}</span>
                                  <Badge className={`ml-1 ${variantStockIndicator.color} px-1 py-0 text-xs`}>{variantStockIndicator.label}</Badge>
                                </span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-3 gap-3 rounded-md border p-3">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                                <p className="font-medium">{variant.sku}</p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Price</p>
                                <div className="flex items-center gap-1">
                                  <p className="font-medium">${variant.price.toFixed(2)}</p>
                                  {variant.salePrice && variant.salePrice > 0 && <p className="text-xs text-muted-foreground line-through">${variant.salePrice.toFixed(2)}</p>}
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Stock</p>
                                <div className="flex items-center">
                                  <p className="font-medium">{variant.stock}</p>
                                  <Badge className={`ml-2 ${variantStockIndicator.color} text-xs`}>
                                    <span className="flex items-center">
                                      {variantStockIndicator.icon}
                                      {variantStockIndicator.label}
                                    </span>
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="mb-2 text-sm font-medium">Attribute Values</p>
                              <div className="flex flex-wrap gap-2">
                                {variant.attributeValues.map((attrValue, attrIndex) => (
                                  <Badge key={attrIndex} className="px-2 py-1" variant="outline">
                                    {attrValue.attributeName}: <span className="ml-1 font-semibold">{attrValue.attributeValueLabel}</span>
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {variant.images && variant.images.length > 0 && (
                              <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Images</p>
                                <div className="grid grid-cols-4 gap-2">
                                  {variant.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="relative aspect-square overflow-hidden rounded-md border">
                                      <img alt={`Variant ${imgIndex + 1}`} className="h-full w-full object-cover" src={image.url} />
                                      {image.isDefault && <Badge className="absolute bottom-1 right-1 text-xs">Default</Badge>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Helmet>
  );
});
