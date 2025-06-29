import { memo } from 'react';

import { Heart, Minus, Plus, Share2, Star } from 'lucide-react';

import type { ProductDetailResponse } from '~/types';

import { Button } from '~/components/common';
import { Badge } from '~/components/ui';
import { Input } from '~/components/ui/input';

import { useAddToCart } from '~/hooks/use-cart-mutation.hook';
import { useToggleWishlistMutation } from '~/hooks/use-wishlist-mutation.hook';
import { useWishlistList } from '~/hooks/use-wishlist.hook';
import { calculateDiscountPercentage, formatPrice } from '~/utils/product.util';

interface ProductInfoProps {
  product: ProductDetailResponse;
  quantity: number;
  selectedVariant?: {
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
  onQuantityChange: (newQuantity: number) => void;
}

export const ProductInfo = memo<ProductInfoProps>(({ product, selectedVariant, quantity, onQuantityChange }) => {
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlistMutation();
  const { data: wishlistResponse } = useWishlistList();

  // Check if product is in wishlist
  const isInWishlist = wishlistResponse?.result?.items?.some((item) => item.product.id === product.id) ?? false;

  // Calculate price and discount
  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.price;
  const originalPrice = selectedVariant?.price || product.price;
  const hasDiscount = Boolean((selectedVariant?.salePrice && selectedVariant.salePrice < selectedVariant.price) || (product.salePrice && product.salePrice < product.price));
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(originalPrice, currentPrice) : 0;

  // Calculate stock
  const currentStock = selectedVariant?.stock || product.stock;

  const handleAddToCart = (): void => {
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity
    });
  };

  const handleToggleWishlist = (): void => {
    toggleWishlist.mutate({ productId: product.id });
  };

  const handleQuantityChange = (newQuantity: number): void => {
    onQuantityChange(Math.min(Math.max(1, newQuantity), currentStock));
  };

  // Render stars for rating
  const renderStars = (rating: number): JSX.Element[] => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
        <p className="mt-2 text-sm text-gray-500">SKU: {selectedVariant?.sku || product.sku}</p>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="flex">{renderStars(product.averageRating || 0)}</div>
          <span className="text-sm text-gray-600">({product.reviewCount || 0} reviews)</span>
        </div>

        {/* Status badges */}
        <div className="flex gap-2">
          {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>}
          {hasDiscount && <Badge className="bg-red-500 hover:bg-red-600">-{discountPercentage}% OFF</Badge>}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
          {hasDiscount && <span className="text-xl text-gray-500 line-through">{formatPrice(originalPrice)}</span>}
        </div>
        {hasDiscount && <p className="text-sm text-green-600">You save {formatPrice(originalPrice - currentPrice)}</p>}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Stock:</span>
        <span className={`text-sm font-medium ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>{currentStock > 0 ? `${currentStock} available` : 'Out of stock'}</span>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        <p className="mt-2 text-gray-600">{product.description}</p>
      </div>

      {/* Category and Seller */}
      <div className="space-y-3">
        {product.category && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <Badge variant="outline">{product.category.name}</Badge>
          </div>
        )}

        {product.seller && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sold by:</span>
            <span className="text-sm font-medium text-gray-900">{product.seller.shopName}</span>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      {!product.hasVariants && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center gap-3">
            <Button disabled={quantity <= 1} size="sm" variant="outline" onClick={() => handleQuantityChange(quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input className="w-20 text-center" max={currentStock} min="1" type="number" value={quantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)} />
            <Button disabled={quantity >= currentStock} size="sm" variant="outline" onClick={() => handleQuantityChange(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1" disabled={currentStock === 0 || addToCart.isPending} size="lg" onClick={handleAddToCart}>
          {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button disabled={toggleWishlist.isPending} size="lg" variant="outline" onClick={handleToggleWishlist}>
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button size="lg" variant="outline">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});
