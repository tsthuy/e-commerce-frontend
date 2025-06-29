import { useCallback } from 'react';

import { formatPrice } from '~/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui';

import { useProductDetail } from '~/hooks/use-product.hook';
import type { CartItemResponse } from '~/types/cart';

interface CartVariantSelectorProps {
  item: CartItemResponse;
  onVariantChange: (itemId: string, variantId: string) => void;
}

export const CartVariantSelector = ({ item, onVariantChange }: CartVariantSelectorProps): JSX.Element => {
  const { data: product, isLoading } = useProductDetail({ productId: item.product.id });

  const handleVariantChange = useCallback(
    (variantId: string) => {
      onVariantChange(item.id, variantId);
    },
    [item.id, onVariantChange]
  );

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Phân loại:</p>
        <div className="h-8 w-full animate-pulse rounded-md bg-gray-200" />
      </div>
    );
  }

  // Nếu không có variants hoặc chỉ có 1 variant
  if (!product?.variants || product.variants.length <= 1) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Phân loại:</p>
        <div className="text-sm text-muted-foreground">{item.variantName || 'Mặc định'}</div>
      </div>
    );
  }

  const currentVariant = product.variants.find((v) => v.id === item.variantId);

  // Nếu item không có variantId nhưng product có variants, có thể là do backend chưa assign variant
  const shouldShowSelector = product.variants.length > 1;
  const effectiveVariantId = item.variantId || (product.variants.length > 0 ? product.variants[0].id : '');

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Phân loại:</p>
      {shouldShowSelector ? (
        <Select value={effectiveVariantId} onValueChange={handleVariantChange}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Chọn phân loại" />
          </SelectTrigger>
          <SelectContent>
            {product.variants.map((variant) => {
              // Tạo tên variant từ attributes
              const variantName = variant.attributes.map((attr) => attr.attributeValueLabel).join(', ');
              const isOutOfStock = variant.stock <= 0;

              // Get effective prices for comparison
              const productEffectivePrice = product.salePrice || product.price;
              const variantEffectivePrice = variant.salePrice || variant.price;
              const showVariantPrice = variantEffectivePrice !== productEffectivePrice;

              return (
                <SelectItem key={variant.id} disabled={isOutOfStock} value={variant.id}>
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className={isOutOfStock ? 'text-muted-foreground' : ''}>
                      {variantName}
                      {isOutOfStock && ' (Hết hàng)'}
                    </span>
                    {showVariantPrice && <span className="text-xs text-primary">{formatPrice(variantEffectivePrice)}</span>}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-sm text-muted-foreground">{currentVariant ? currentVariant.attributes.map((attr) => attr.attributeValueLabel).join(', ') : item.variantName || 'Mặc định'}</div>
      )}

      {/* Hiển thị thông tin variant hiện tại */}
      {currentVariant && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Còn lại: {currentVariant.stock}</span>
          {(currentVariant.salePrice || currentVariant.price) !== (product.salePrice || product.price) && <span>Giá: {formatPrice(currentVariant.salePrice || currentVariant.price)}</span>}
        </div>
      )}
    </div>
  );
};
