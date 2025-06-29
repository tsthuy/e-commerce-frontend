import { ShoppingCart } from 'lucide-react';

import { Button } from '~/components/common';
import { Badge } from '~/components/ui';

import { CartSheet } from './cart-sheet';

import { useCartList } from '~/hooks/use-cart.hook';

export const CartIcon = (): JSX.Element => {
  const { data: cart } = useCartList();

  return (
    <CartSheet>
      <Button className="relative" size="icon" variant="default">
        <ShoppingCart className="h-5 w-5" />
        {cart?.result && cart.result.totalItems > 0 && (
          <Badge className="absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] leading-none" variant="destructive">
            {cart.result.totalItems}
          </Badge>
        )}
        <span className="sr-only">Giỏ hàng</span>
      </Button>
    </CartSheet>
  );
};
