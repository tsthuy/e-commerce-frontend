import { memo } from 'react';

import { Heart, MessageCircle, Minus, Plus, Share2, Star } from 'lucide-react';
import { useHistory } from 'react-router-dom';

import type { ProductDetailResponse } from '~/types';

import { useTranslation } from '~/hooks';

import { Button } from '~/components/common';
import { Badge } from '~/components/ui';
import { Input } from '~/components/ui/input';

import { useAddToCart } from '~/hooks/use-cart-mutation.hook';
import { useProfile } from '~/hooks/use-profile.hook';
import { useStableBehaviorTracking } from '~/hooks/use-stable-behavior-tracking.hook';
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
  const { trackBehavior } = useStableBehaviorTracking();
  const { data: wishlistResponse } = useWishlistList();
  const { data: profileResponse } = useProfile({ enabled: true });

  const { push } = useHistory();

  const { t } = useTranslation();
  const isInWishlist = wishlistResponse?.result?.items?.some((item) => item.product.id === product.id) ?? false;

  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.price;
  const originalPrice = selectedVariant?.price || product.price;
  const hasDiscount = Boolean((selectedVariant?.salePrice && selectedVariant.salePrice < selectedVariant.price) || (product.salePrice && product.salePrice < product.price));
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(originalPrice, currentPrice) : 0;
  const currentStock = selectedVariant?.stock || product.stock;

  const handleAddToCart = (): void => {
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity
    });
    trackBehavior({
      productId: product.id,
      actionType: 'ADD_TO_CART'
    });
  };

  const handleToggleWishlist = (): void => {
    toggleWishlist.mutate({ productId: product.id });

    if (!isInWishlist) {
      trackBehavior({
        productId: product.id,
        actionType: 'ADD_TO_WISHLIST'
      });
    }
  };

  const handleMessageSeller = (): void => {
    if (!product.seller?.shopName || !profileResponse?.id) return;

    const customerId = profileResponse.id;

    const sellerId = product.seller?.id;
    const conversationId = `${customerId}_${sellerId}`;

    push(`/user/messages/conversation/${conversationId}`);
  };

  const handleQuantityChange = (newQuantity: number): void => {
    onQuantityChange(Math.min(Math.max(1, newQuantity), currentStock));
  };

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

  const handleViewSellerProfile = (): void => {
    if (!product.seller?.id) return;
    push(`/shop/preview/${product.seller.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
        <p className="mt-2 text-sm text-gray-500">SKU: {selectedVariant?.sku || product.sku}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="flex">{renderStars(product.averageRating || 0)}</div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount || 0} {t('Product.reviews')})
          </span>
        </div>
        <div className="flex gap-2">
          {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600">{t('Product.new')}</Badge>}
          {hasDiscount && (
            <Badge className="bg-red-500 hover:bg-red-600">
              -{discountPercentage}% {t('Product.off')}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
          {hasDiscount && <span className="text-xl text-gray-500 line-through">{formatPrice(originalPrice)}</span>}
        </div>
        {hasDiscount && (
          <p className="text-sm text-green-600">
            {t('Product.youSave')} {formatPrice(originalPrice - currentPrice)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{t('Product.stock')}:</span>
        <span className={`text-sm font-medium ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {currentStock > 0 ? `${currentStock} ${t('Product.available')}` : t('Product.outOfStock')}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t('Product.description')}</h3>
        <p className="mt-2 text-gray-600">{product.description}</p>
      </div>
      <div className="space-y-3">
        {product.category && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{t('Product.category')}:</span>
            <Badge variant="outline">{product.category.name}</Badge>
          </div>
        )}

        {product.seller && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{t('Product.soldBy')}:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 hover:cursor-pointer" onClick={handleViewSellerProfile}>
                {product.seller.shopName}
              </span>
              <Button className="h-8 w-8 p-0 text-gray-500 hover:text-primary" size="sm" variant="ghost" onClick={handleMessageSeller}>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {!product.hasVariants && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">{t('Product.quantity')}:</span>
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

      <div className="flex gap-3">
        <Button className="flex-1" disabled={currentStock === 0 || addToCart.isPending} size="lg" onClick={handleAddToCart}>
          {addToCart.isPending ? t('Product.adding') : t('Product.addToCart')}
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
