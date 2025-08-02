import { memo } from 'react';

import { Minus, Plus } from 'lucide-react';

import type { ProductDetailResponse } from '~/types';

import { Button } from '~/components/common';

interface ProductVariantSelectorProps {
  product: ProductDetailResponse;
  selectedAttributes: Record<string, string>;
  selectedVariant: {
    id: string;
    sku: string;
    price: number;
    salePrice?: number;
    stock: number;
    attributes: Array<{
      attributeId?: string;
      attributeName: string;
      valueId?: string;
      attributeValueLabel: string;
      attributeValue?: string;
    }>;
    images: Array<{
      url: string;
      publicId?: string;
      isDefault: boolean;
    }>;
  } | null;
  quantity: number;
  onAttributeChange: (attributeName: string, attributeValue: string) => void;
  onQuantityChange: (quantity: number) => void;
}

export const ProductVariantSelector = memo<ProductVariantSelectorProps>(({ product, selectedAttributes, selectedVariant, quantity, onAttributeChange, onQuantityChange }) => {
  const maxStock = selectedVariant?.stock || product.stock;

  // Get available values for each attribute based on available variants
  const getAvailableValues = (attributeName: string): string[] => {
    const currentSelections = { ...selectedAttributes };
    delete currentSelections[attributeName]; // Remove current attribute from filter

    // Find variants that match current selections (excluding the current attribute)
    const matchingVariants = product.variants.filter((variant) => {
      return Object.entries(currentSelections).every(([attrName, attrValue]) => {
        return variant.attributes.some((attr) => {
          const variantValue = attr.attributeValue || attr.attributeValueLabel;
          return attr.attributeName === attrName && variantValue === attrValue;
        });
      });
    });

    // Get available values for the current attribute from matching variants
    const availableValues = new Set<string>();
    matchingVariants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (attr.attributeName === attributeName) {
          const value = attr.attributeValue || attr.attributeValueLabel;
          availableValues.add(value);
        }
      });
    });

    return Array.from(availableValues);
  };

  return (
    <div className="space-y-6">
      {/* Attribute Selectors */}
      <div className="space-y-4">
        {product.attributes.map((attribute) => {
          const availableValues = getAvailableValues(attribute.name);
          const selectedValue = selectedAttributes[attribute.name];

          return (
            <div key={attribute.id} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                {attribute.name}:<span className="ml-1 font-normal text-gray-600">{selectedValue || 'Please select'}</span>
              </h4>

              <div className="flex flex-wrap gap-2">
                {attribute.values.map((value) => {
                  const isAvailable = availableValues.includes(value.value);
                  const isSelected = selectedValue === value.value;

                  return (
                    <button
                      key={value.id}
                      disabled={!isAvailable}
                      type="button"
                      className={`min-w-[48px] rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : isAvailable
                            ? 'border-gray-300 bg-white text-gray-900 hover:border-primary hover:text-primary'
                            : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                      }`}
                      onClick={() => isAvailable && onAttributeChange(attribute.name, value.value)}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Quantity</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border border-gray-300">
            <Button className="h-10 w-10 rounded-none border-0 hover:bg-gray-100" disabled={quantity <= 1} size="sm" variant="ghost" onClick={() => onQuantityChange(quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>

            <input
              className="h-10 w-16 border-0 text-center focus:ring-0"
              max={maxStock}
              min={1}
              type="number"
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value) || 1;
                onQuantityChange(newQuantity);
              }}
            />

            <Button className="h-10 w-10 rounded-none border-0 hover:bg-gray-100" disabled={quantity >= maxStock} size="sm" variant="ghost" onClick={() => onQuantityChange(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-sm text-gray-500">{maxStock} available</span>
        </div>
      </div>
    </div>
  );
});
