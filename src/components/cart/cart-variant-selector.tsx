import { useCallback } from 'react';

import type { AnyType } from '~/types';

import { useProductDetail, useTranslation } from '~/hooks';

import { formatPrice } from '~/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui';

import type { CartItemResponse } from '~/types/cart';

interface CartVariantSelectorProps {
  item: CartItemResponse;
  onVariantChange: (itemId: string, variantId: string) => void;
}

export const CartVariantSelector = ({ item, onVariantChange }: CartVariantSelectorProps): JSX.Element => {
  const { data: product, isLoading } = useProductDetail({ data: { productId: item.product.id } });
  const { t } = useTranslation();

  const handleVariantChange = useCallback(
    (variantId: string) => {
      onVariantChange(item.id, variantId);
    },
    [item.id, onVariantChange]
  );
  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">{t('Product.variant')}:</p>
        <div className="h-8 w-full animate-pulse rounded-md bg-gray-200" />
      </div>
    );
  }

  if (!product?.variants || product.variants.length <= 1) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">{t('Product.variant')}:</p>
        <div className="text-sm text-muted-foreground">{item.variantName || t('Product.defaultVariant')}</div>
      </div>
    );
  }

  const currentVariant = product.variants.find((v: AnyType) => v.id === item.variantId);

  const shouldShowSelector = product.variants.length > 1;
  const effectiveVariantId = item.variantId || (product.variants.length > 0 ? product.variants[0].id : '');

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t('Product.variant')}:</p>
      {shouldShowSelector ? (
        <Select value={effectiveVariantId} onValueChange={handleVariantChange}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder={t('Product.selectVariant')} />
          </SelectTrigger>
          <SelectContent>
            {product.variants.map((variant: AnyType) => {
              const variantName = variant.attributes.map((attr: AnyType) => attr.attributeValueLabel).join(', ');
              const isOutOfStock = variant.stock <= 0;

              const productEffectivePrice = product.salePrice || product.price;
              const variantEffectivePrice = variant.salePrice || variant.price;
              const showVariantPrice = variantEffectivePrice !== productEffectivePrice;

              return (
                <SelectItem key={variant.id} disabled={isOutOfStock} value={variant.id}>
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className={isOutOfStock ? 'text-muted-foreground' : ''}>
                      {variantName}
                      {isOutOfStock && ` (${t('Product.outOfStock')})`}
                    </span>
                    {showVariantPrice && <span className="text-xs text-primary">{formatPrice(variantEffectivePrice)}</span>}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-sm text-muted-foreground">
          {currentVariant ? currentVariant.attributes.map((attr: AnyType) => attr.attributeValueLabel).join(', ') : item.variantName || t('Product.defaultVariant')}
        </div>
      )}

      {currentVariant && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {t('Product.stockRemaining')}: {currentVariant.stock}
          </span>
          {(currentVariant.salePrice || currentVariant.price) !== (product.salePrice || product.price) && (
            <span>
              {t('Product.price')}: {formatPrice(currentVariant.salePrice || currentVariant.price)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
