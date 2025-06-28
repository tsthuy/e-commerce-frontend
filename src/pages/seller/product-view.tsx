/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo } from 'react';

import { ArrowLeft, Calendar, DollarSign, Edit, Package, Star } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';

import { useProductDetail } from '~/hooks';

import { Button, Container, Helmet } from '~/components/common';
import { Card } from '~/components/ui';

export const ProductView = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const { data: product, isLoading } = useProductDetail({
    productId: id || '',
    enabled: !!id
  });

  const handleEdit = (): void => {
    history.push(`/seller/edit-product/${id}`);
  };

  const handleBack = (): void => {
    history.push('/seller/all-products');
  };

  if (isLoading) {
    return (
      <Helmet title="Loading Product...">
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
      <Helmet title="Product Not Found">
        <Container className="px-6 py-8">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Product Not Found</h1>
            <p className="mb-6 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
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
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>
          </div>
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Product Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-900">{product.category?.name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : product.status === 'INACTIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status}
                    </span>
                    {product.isPublished && <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">Published</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    {product.salePrice ? (
                      <>
                        <span className="font-medium text-red-600">${product.salePrice}</span>
                        <span className="text-gray-500 line-through">${product.price}</span>
                      </>
                    ) : (
                      <span className="font-medium">${product.price}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stock</label>
                  <p className={`${product.stock <= 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{product.stock} units</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900">{product.description}</p>
              </div>
            </Card>

            {/* Images */}
            {product.images && product.images.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Product Images</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img alt={`${product.name} ${index + 1}`} className="h-32 w-full rounded-lg border object-cover" src={image.url} />
                      {image.isDefault && <span className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">Default</span>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Product Attributes</h2>
                <div className="space-y-4">
                  {product.attributes.map((attribute) => (
                    <div key={attribute.id}>
                      <label className="text-sm font-medium text-gray-500">{attribute.name}</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {attribute.values.map((value) => (
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
                <h2 className="mb-4 text-xl font-semibold">Product Variants ({product.variantCount})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">Attributes</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant) => (
                        <tr key={variant.id} className="border-b">
                          <td className="px-4 py-3 font-medium">{variant.sku}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {variant.attributes.map((attr) => (
                                <span key={`${attr.attributeId}-${attr.valueId}`} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                  {attr.attributeName}: {attr.attributeValueLabel}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {variant.salePrice ? (
                              <>
                                <span className="font-medium text-red-600">${variant.salePrice}</span>
                                <span className="ml-1 text-xs text-gray-500 line-through">${variant.price}</span>
                              </>
                            ) : (
                              <span>${variant.price}</span>
                            )}
                          </td>
                          <td className={`px-4 py-3 ${variant.stock <= 0 ? 'text-red-600' : variant.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{variant.stock}</td>
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
              <h2 className="mb-4 text-lg font-semibold">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-medium">{product.imageCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attributes</span>
                  <span className="font-medium">{product.attributeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Variants</span>
                  <span className="font-medium">{product.variantCount}</span>
                </div>
                {product.averageRating && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-400" />
                      <span className="font-medium">{product.averageRating}</span>
                    </div>
                  </div>
                )}
                {product.reviewCount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-medium">{product.reviewCount}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Metadata</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Created
                  </div>
                  <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="mb-1 flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Updated
                  </div>
                  <p className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
                {product.seller && (
                  <div>
                    <div className="mb-1 text-gray-600">Seller</div>
                    <p className="text-sm font-medium">{product.seller.shopName}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Helmet>
  );
});

ProductView.displayName = 'ProductView';
