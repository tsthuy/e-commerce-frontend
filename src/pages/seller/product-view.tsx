/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo, useState } from 'react';

import { ArrowLeft, Calendar, DollarSign, Edit, Eye, Package, Star } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';

import type { ProductDetailResponse } from '~/types';

import { useProductDetail, useTranslation } from '~/hooks';

import { formatPrice } from '~/utils';

import { Button, Container, Helmet } from '~/components/common';
import { Card, Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui';

export const ProductView = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { t } = useTranslation();
  const [selectedVariant, setSelectedVariant] = useState<ProductDetailResponse['variants'][0] | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const { data: product, isLoading } = useProductDetail({
    data: { productId: id },
    enabled: !!id
  });

  const handleEdit = (): void => {
    history.push(`/seller/edit-product/${id}`);
  };

  const handleBack = (): void => {
    history.goBack();
  };

  const handleViewVariant = (variant: ProductDetailResponse['variants'][0]): void => {
    setSelectedVariant(variant);
    setIsVariantModalOpen(true);
  };
  if (isLoading) {
    return (
      <Helmet title={t('Common.loading')}>
        <Container className="px-6 py-8">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-48 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="h-64 rounded bg-gray-200"></div>
              <div className="space-y-4">
                <div className="h-6 rounded bg-gray-200"></div>
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </Container>
      </Helmet>
    );
  }

  if (!product) {
    return (
      <Helmet title={t('Product.productNotFound')}>
        <Container className="px-6 py-8">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('Product.productNotFound')}</h1>
            <p className="mb-6 text-gray-600">{t('Product.productNotFoundDesc')}</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('Common.back')}
            </Button>
          </div>
        </Container>
      </Helmet>
    );
  }

  return (
    <Helmet title={product.name}>
      <Container className="px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('Common.back')}
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>
          </div>
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t('Seller.editProduct')}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">{t('Product.productInformation')}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Product.productCategory')}</label>
                  <p className="text-gray-900">{product.category?.name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Product.productStatus')}</label>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : product.status === 'INACTIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status}
                    </span>
                    {product.isPublished && <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">{t('Common.published')}</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Common.price')}</label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    {product.salePrice ? (
                      <>
                        <span className="font-medium text-red-600">{formatPrice(product.salePrice)}</span>
                        <span className="text-gray-500 line-through">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Product.productStock')}</label>
                  <p className={`${product.stock <= 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {product.stock} {t('Product.units')}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">{t('Product.productDescription')}</label>
                <p className="mt-1 text-gray-900">{product.description}</p>
              </div>
            </Card>

            {/* Images */}
            {product.images && product.images.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">{t('Product.productImages')}</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {product.images.map((image: ProductDetailResponse['images'][0], index: number) => (
                    <div key={index} className="relative">
                      <img alt={`${product.name} ${index + 1}`} className="h-32 w-full rounded-lg border object-cover" src={image.url} />
                      {image.isDefault && <span className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">{t('Common.default')}</span>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">{t('Product.productAttributes')}</h2>
                <div className="space-y-4">
                  {product.attributes.map((attribute: ProductDetailResponse['attributes'][0]) => (
                    <div key={attribute.id}>
                      <label className="text-sm font-medium text-gray-500">{attribute.name}</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {attribute.values.map((value: ProductDetailResponse['attributes'][0]['values'][0]) => (
                          <span key={value.id} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                            {value.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  {t('Product.productVariants')} ({product.variantCount})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left">{t('Common.image')}</th>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">{t('Product.attributes')}</th>
                        <th className="px-4 py-3 text-left">{t('Common.price')}</th>
                        <th className="px-4 py-3 text-left">{t('Product.productStock')}</th>
                        <th className="px-4 py-3 text-center">{t('Common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant: ProductDetailResponse['variants'][0]) => (
                        <tr key={variant.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {variant.images && variant.images.length > 0 ? (
                              <img alt={`Variant ${variant.sku}`} className="h-12 w-12 rounded-lg border object-cover" src={variant.images[0].url} />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-gray-100">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium">{variant.sku}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {variant.attributes.map((attr: ProductDetailResponse['variants'][0]['attributes'][0]) => (
                                <span key={`${attr.attributeName}-${attr.attributeValueLabel}`} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                  {attr.attributeName}: {attr.attributeValueLabel}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {variant.salePrice ? (
                              <div className="flex flex-col">
                                <span className="font-medium text-red-600">{formatPrice(variant.salePrice)}</span>
                                <span className="text-xs text-gray-500 line-through">{formatPrice(variant.price)}</span>
                              </div>
                            ) : (
                              <span className="font-medium">{formatPrice(variant.price)}</span>
                            )}
                          </td>
                          <td className={`px-4 py-3 font-medium ${variant.stock <= 0 ? 'text-red-600' : variant.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {variant.stock} {t('Product.units')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button size="sm" variant="outline" onClick={() => handleViewVariant(variant)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">{t('Seller.quickStats')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('Seller.totalImages')}</span>
                  <span className="font-medium">{product.imageCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('Product.productAttributes')}</span>
                  <span className="font-medium">{product.attributeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('Product.productVariants')}</span>
                  <span className="font-medium">{product.variantCount}</span>
                </div>
                {product.averageRating && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('Product.productRating')}</span>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-400" />
                      <span className="font-medium">{product.averageRating}</span>
                    </div>
                  </div>
                )}
                {product.reviewCount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('Product.productReviews')}</span>
                    <span className="font-medium">{product.reviewCount}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">{t('Seller.metadata')}</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('Common.createdAt')}
                  </div>
                  <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="mb-1 flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('Common.updatedAt')}
                  </div>
                  <p className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
                {product.seller && (
                  <div>
                    <div className="mb-1 text-gray-600">{t('Common.seller')}</div>
                    <p className="text-sm font-medium">{product.seller.shopName}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
        {/* Variant Detail Modal */}
        <Dialog open={isVariantModalOpen} onOpenChange={setIsVariantModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>
                  {t('Product.variantDetails')} - {selectedVariant?.sku}
                </span>
              </DialogTitle>
            </DialogHeader>

            {selectedVariant && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Images */}
                <div>
                  <h3 className="mb-3 font-semibold">{t('Product.variantImages')}</h3>
                  {selectedVariant.images && selectedVariant.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedVariant.images.map((image: ProductDetailResponse['variants'][0]['images'][0], index: number) => (
                        <div key={index} className="relative">
                          <img alt={`${selectedVariant.sku} ${index + 1}`} className="h-32 w-full rounded-lg border object-cover" src={image.url} />
                          {image.isDefault && <span className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">{t('Common.default')}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border bg-gray-50">
                      <div className="text-center text-gray-500">
                        <Package className="mx-auto mb-2 h-8 w-8" />
                        <p className="text-sm">{t('Product.noImages')}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Information */}
                <div>
                  <h3 className="mb-3 font-semibold">{t('Product.variantInformation')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">SKU</label>
                      <p className="font-medium">{selectedVariant.sku}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('Common.price')}</label>
                      <div className="flex items-center space-x-2">
                        {selectedVariant.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-red-600">{formatPrice(selectedVariant.salePrice)}</span>
                            <span className="text-gray-500 line-through">{formatPrice(selectedVariant.price)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">{formatPrice(selectedVariant.price)}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('Product.productStock')}</label>
                      <p className={`font-medium ${selectedVariant.stock <= 0 ? 'text-red-600' : selectedVariant.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {selectedVariant.stock} {t('Product.units')}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">{t('Product.attributes')}</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedVariant.attributes.map((attr: ProductDetailResponse['variants'][0]['attributes'][0]) => (
                          <span key={`${attr.attributeName}-${attr.attributeValueLabel}`} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                            {attr.attributeName}: {attr.attributeValueLabel}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Helmet>
  );
});

ProductView.displayName = 'ProductView';
