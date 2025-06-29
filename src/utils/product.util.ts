import type { ProductResponse, SimpleProduct } from '~/types';

/**
 * Map ProductResponse to SimpleProduct for display in product cards
 */
export const mapToSimpleProduct = (product: ProductResponse): SimpleProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    defaultImageUrl: product.defaultImageUrl,
    averageRating: product.averageRating || 0,
    reviewCount: product.reviewCount || 0,
    soldCount: product.soldCount || 0,
    categoryName: product.categoryName,
    sellerName: product.sellerName,
    status: product.status,
    isNew: product.isNew
  };
};

/**
 * Map array of ProductResponse to array of SimpleProduct
 */
export const mapToSimpleProducts = (products: ProductResponse[]): SimpleProduct[] => {
  return products.map(mapToSimpleProduct);
};

/**
 * Truncate text with ellipsis if it exceeds maxLength
 */
export const truncateText = (text: string, maxLength: number = 30): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (!salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};
