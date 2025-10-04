import { memo, useMemo, useState } from 'react';

import type { ProductDetailResponse } from '~/types';

import { useTranslation } from '~/hooks';

import { ReviewList, StarRating } from '~/components/common';
import { ProductImageGallery } from '~/components/pages/public/product-detail/product-image-gallery';
import { ProductInfo } from '~/components/pages/public/product-detail/product-info';
import { ProductVariantSelector } from '~/components/pages/public/product-detail/product-variant-selector';

interface ProductDetailContentProps {
  product: ProductDetailResponse;
}

export const ProductDetailContent = memo<ProductDetailContentProps>(({ product }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(product.variants.length > 0 ? product.variants[0].id : null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(() => {
    return product.defaultImageUrl || product.images[0]?.url || '';
  });

  const { t } = useTranslation();
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    if (product.variants.length > 0) {
      const firstVariant = product.variants[0];
      return firstVariant.attributes.reduce(
        (acc, attr) => {
          acc[attr.attributeName] = attr.attributeValue || attr.attributeValueLabel;
          return acc;
        },
        {} as Record<string, string>
      );
    }
    return {};
  });
  const [quantity, setQuantity] = useState<number>(1);

  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) => variant.id === selectedVariantId) || null;
  }, [product.variants, selectedVariantId]);

  const allImages = useMemo(() => {
    const images: Array<{
      url: string;
      isDefault: boolean;
      source: 'product' | 'variant';
      variantId?: string;
      alt: string;
    }> = [];
    product.images.forEach((img) => {
      images.push({
        url: img.url,
        isDefault: img.isDefault,
        source: 'product',
        alt: `${product.name} - Product Image`
      });
    });

    product.variants.forEach((variant) => {
      variant.images.forEach((img) => {
        images.push({
          url: img.url,
          isDefault: img.isDefault,
          source: 'variant',
          variantId: variant.id,
          alt: `${product.name} - ${variant.attributes.map((a) => a.attributeValueLabel).join(', ')}`
        });
      });
    });

    return images;
  }, [product]);
  const handleImageSelect = (imageUrl: string): void => {
    setSelectedImageUrl(imageUrl);

    const image = allImages.find((img) => img.url === imageUrl);
    if (image && image.source === 'variant' && image.variantId) {
      setSelectedVariantId(image.variantId);

      const variant = product.variants.find((v) => v.id === image.variantId);
      if (variant) {
        const newAttributes = variant.attributes.reduce(
          (acc, attr) => {
            acc[attr.attributeName] = attr.attributeValue || attr.attributeValueLabel;
            return acc;
          },
          {} as Record<string, string>
        );
        setSelectedAttributes(newAttributes);
      }
    } else if (image && image.source === 'product') {
      if (!selectedVariantId && product.variants.length > 0) {
        setSelectedVariantId(product.variants[0].id);
      }
    }
  };

  const handleAttributeChange = (attributeName: string, attributeValue: string): void => {
    const newAttributes = { ...selectedAttributes, [attributeName]: attributeValue };
    setSelectedAttributes(newAttributes);
    const matchingVariant = product.variants.find((variant) => {
      return variant.attributes.every((attr) => {
        const attrValue = attr.attributeValue || attr.attributeValueLabel;
        return newAttributes[attr.attributeName] === attrValue;
      });
    });

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
      if (matchingVariant.images && matchingVariant.images.length > 0) {
        const defaultImg = matchingVariant.images.find((img) => img.isDefault);
        const newImageUrl = defaultImg?.url || matchingVariant.images[0].url;
        setSelectedImageUrl(newImageUrl);
      }
    }
  };

  const handleQuantityChange = (newQuantity: number): void => {
    const maxStock = selectedVariant?.stock || product.stock;
    setQuantity(Math.min(Math.max(1, newQuantity), maxStock));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ProductImageGallery allImages={allImages} currentMainImage={selectedImageUrl} productName={product.name} onImageSelect={handleImageSelect} />
        </div>

        <div className="space-y-6">
          <ProductInfo product={product} quantity={quantity} selectedVariant={selectedVariant} onQuantityChange={handleQuantityChange} />

          {product.hasVariants && (
            <ProductVariantSelector
              product={product}
              quantity={quantity}
              selectedAttributes={selectedAttributes}
              selectedVariant={selectedVariant}
              onAttributeChange={handleAttributeChange}
              onQuantityChange={handleQuantityChange}
            />
          )}
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="mb-6">
          <h3 className="mb-4 text-2xl font-semibold">{t('Product.customerReviews')}</h3>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StarRating rating={product.averageRating || 0} size="lg" />
              <span className="text-lg font-medium">{(product.averageRating || 0).toFixed(1)}</span>
            </div>
            <span className="text-gray-600">
              ({product.reviewCount || 0} {t('Product.reviews')})
            </span>
          </div>
        </div>

        <ReviewList className="max-h-96 overflow-y-auto" productId={product.id} />
      </div>
    </div>
  );
});
