import { memo, useMemo, useState } from 'react';

import type { ProductDetailResponse } from '~/types';

import { ProductImageGallery } from '~/components/pages/public/product-detail/product-image-gallery';
import { ProductInfo } from '~/components/pages/public/product-detail/product-info';
import { ProductVariantSelector } from '~/components/pages/public/product-detail/product-variant-selector';

interface ProductDetailContentProps {
  product: ProductDetailResponse;
}

export const ProductDetailContent = memo<ProductDetailContentProps>(({ product }) => {
  // State for selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(product.variants.length > 0 ? product.variants[0].id : null);

  // State for selected image URL (this is the key change)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(() => {
    // Start with product's default image or first image
    return product.defaultImageUrl || product.images[0]?.url || '';
  });

  // State for selected attributes
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

  // State for quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Get current selected variant
  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) => variant.id === selectedVariantId) || null;
  }, [product.variants, selectedVariantId]);

  // Combine all images (product images + variant images) with source info
  const allImages = useMemo(() => {
    const images: Array<{
      url: string;
      isDefault: boolean;
      source: 'product' | 'variant';
      variantId?: string;
      alt: string;
    }> = [];

    // Add product images
    product.images.forEach((img) => {
      images.push({
        url: img.url,
        isDefault: img.isDefault,
        source: 'product',
        alt: `${product.name} - Product Image`
      });
    });

    // Add variant images
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

  // Handle image selection from gallery
  const handleImageSelect = (imageUrl: string): void => {
    setSelectedImageUrl(imageUrl);

    // Find if this image belongs to a variant
    const image = allImages.find((img) => img.url === imageUrl);
    if (image && image.source === 'variant' && image.variantId) {
      // If it's a variant image, update the selected variant
      setSelectedVariantId(image.variantId);

      // Update selected attributes based on the variant
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
      // If it's a product image (not variant), keep current variant or select first one
      if (!selectedVariantId && product.variants.length > 0) {
        setSelectedVariantId(product.variants[0].id);
      }
    }
  };

  // Handle attribute change
  const handleAttributeChange = (attributeName: string, attributeValue: string): void => {
    const newAttributes = { ...selectedAttributes, [attributeName]: attributeValue };
    setSelectedAttributes(newAttributes);

    // Find matching variant
    const matchingVariant = product.variants.find((variant) => {
      return variant.attributes.every((attr) => {
        const attrValue = attr.attributeValue || attr.attributeValueLabel;
        return newAttributes[attr.attributeName] === attrValue;
      });
    });

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);

      // Update selected image to the variant's default image
      if (matchingVariant.images && matchingVariant.images.length > 0) {
        const defaultImg = matchingVariant.images.find((img) => img.isDefault);
        const newImageUrl = defaultImg?.url || matchingVariant.images[0].url;
        setSelectedImageUrl(newImageUrl);
      }
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number): void => {
    const maxStock = selectedVariant?.stock || product.stock;
    setQuantity(Math.min(Math.max(1, newQuantity), maxStock));
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Left side - Image Gallery */}
      <div className="space-y-4">
        <ProductImageGallery allImages={allImages} currentMainImage={selectedImageUrl} productName={product.name} onImageSelect={handleImageSelect} />
      </div>

      {/* Right side - Product Info */}
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
  );
});
