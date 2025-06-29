import type React from 'react';

import { Heart } from 'lucide-react';

import { Badge } from '~/components/ui';

import { useWishlistList } from '~/hooks/use-wishlist.hook';

interface WishlistIconProps {
  children?: React.ReactNode;
  className?: string;
}

export const WishlistIcon = ({ children, className = '' }: WishlistIconProps): JSX.Element => {
  const { data: wishlistResponse } = useWishlistList();
  const wishlist = wishlistResponse?.result;
  const totalItems = wishlist?.totalItems || 0;

  return (
    <div className={`relative ${className}`}>
      {children || <Heart className="h-5 w-5" />}
      {totalItems > 0 && (
        <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs font-bold text-white">{totalItems > 99 ? '99+' : totalItems}</Badge>
      )}
    </div>
  );
};
