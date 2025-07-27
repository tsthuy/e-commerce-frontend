import { memo } from 'react';

import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { DEFAULT_IMG_SAMPLE } from '~/constants';

import type { SimpleProduct } from '~/types';

import { Button } from '~/components/common';
import { Badge } from '~/components/ui';

import { useAddToCart } from '~/hooks/use-cart-mutation.hook';
import { useToggleWishlistMutation } from '~/hooks/use-wishlist-mutation.hook';
import { useCheckProductInWishlist } from '~/hooks/use-wishlist.hook';
import { calculateDiscountPercentage, formatPrice, truncateText } from '~/utils/product.util';

interface ProductCardProps {
  product: SimpleProduct;
  linkTo?: string;
}

export const ProductCard = memo<ProductCardProps>(({ product, linkTo = '#' }) => {
  const location = useLocation();
  const isPreviewMode = location.pathname.includes('/seller/');

  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlistMutation();
  const { data: isInWishlistResponse } = useCheckProductInWishlist(product.id);
  const isInWishlist = isInWishlistResponse?.result || false;

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(product.price, product.salePrice!) : 0;
  const displayPrice = product.salePrice || product.price;
  const originalPrice = hasDiscount ? product.price : undefined;

  const handleAddToCart = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    addToCart.mutate({
      productId: product.id,
      quantity: 1
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist.mutate({
      productId: product.id
    });
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

  return (
    <div className="group relative w-full overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image Container */}
      <div className="relative flex w-full justify-center bg-gray-50">
        <div className="aspect-square w-full p-4">
          <img alt={product.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" src={product.defaultImageUrl || DEFAULT_IMG_SAMPLE} />
        </div>

        {/* Action Buttons - Hidden in preview mode */}
        {!isPreviewMode && (
          <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              className={`h-8 w-8 p-0 ${isInWishlist ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              disabled={toggleWishlist.isPending}
              size="sm"
              variant={isInWishlist ? 'default' : 'secondary'}
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </Button>
            <Button className="h-8 w-8 p-0" size="sm" variant="secondary">
              <Eye className="h-4 w-4" />
            </Button>
            <Button className="h-8 w-8 p-0" disabled={addToCart.isPending} size="sm" variant="secondary" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>}
          {hasDiscount && <Badge className="bg-red-500 hover:bg-red-600">-{discountPercentage}%</Badge>}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-2 p-4">
        {/* Product Name */}
        <Link className="text-lg font-semibold hover:text-primary hover:underline" title={product.name} to={linkTo}>
          {truncateText(product.name, 40)}
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground" title={product.description}>
          {truncateText(product.description, 30)}
        </p>

        {/* Category */}
        {product.categoryName && <span className="text-xs text-gray-500">{product.categoryName}</span>}

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">{renderStars(product.averageRating || 0)}</div>
          <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
        </div>

        {/* Price and Sales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(displayPrice)}</span>
            {originalPrice && <span className="text-sm text-gray-500 line-through">{formatPrice(originalPrice)}</span>}
          </div>
          <span className="text-sm font-medium text-green-600">{product.soldCount || 0} sold</span>
        </div>

        {/* Seller */}
        {product.sellerName && (
          <div className="text-xs text-gray-500">
            by <span className="font-medium">{product.sellerName}</span>
          </div>
        )}
      </div>
    </div>
  );
});
