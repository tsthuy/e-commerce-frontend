import React, { useCallback, useState } from 'react';

import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';

import { DEFAULT_IMG_AVATAR } from '~/constants';

import { useDebounce, useTranslation } from '~/hooks';

import { formatPrice } from '~/utils';

import { Button } from '~/components/common';
import { Card, CardContent, Input, ScrollArea, Separator, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui';

import { CartVariantSelector } from './cart-variant-selector';

import { useRemoveCartItem, useUpdateCartItem } from '~/hooks/use-cart-mutation.hook';
import { useCartList } from '~/hooks/use-cart.hook';
import { PROTECTED_ROUTES } from '~/routes/protected.route';

interface CartSheetProps {
  children: React.ReactNode;
}

export const CartSheet = ({ children }: CartSheetProps): JSX.Element => {
  const { data: cartResponse, isLoading } = useCartList();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const { t } = useTranslation();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const debouncedQuantities = useDebounce(quantities, 1000);

  const cart = cartResponse?.result;

  React.useEffect(() => {
    if (!cart?.items || Object.keys(debouncedQuantities).length === 0 || updateCartItem.isPending) return;

    Object.entries(debouncedQuantities).forEach(([itemId, quantity]) => {
      const currentItem = cart.items.find((item) => item.id === itemId);
      if (currentItem && currentItem.quantity !== quantity && quantity > 0) {
        updateCartItem.mutate({ itemId, data: { quantity } });
      }
    });
  }, [debouncedQuantities, cart?.items]);

  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
  }, []);

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      removeCartItem.mutate(itemId);
    },
    [removeCartItem]
  );

  const handleVariantChange = useCallback(
    (itemId: string, variantId: string) => {
      updateCartItem.mutate({
        itemId,
        data: { variantId }
      });
    },
    [updateCartItem]
  );

  const getItemQuantity = useCallback(
    (itemId: string) => {
      return quantities[itemId] ?? cart?.items.find((item) => item.id === itemId)?.quantity ?? 1;
    },
    [quantities, cart?.items]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">{children}</div>
      </SheetTrigger>

      <SheetContent className="!w-[600px] !max-w-none">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('Cart.cart')} ({cart?.totalItems || 0})
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-muted-foreground">{t('Common.loading')}</p>
              </div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">{t('Cart.emptyCart')}</p>
                <p className="text-muted-foreground">{t('Cart.emptyCartDesc')}</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="mt-6 flex-1">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Ảnh sản phẩm */}
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <img alt={item.product.name} className="h-full w-full object-cover" src={item.variantImage || item.product.defaultImageUrl || DEFAULT_IMG_AVATAR} />
                          </div>

                          <div className="flex-1 space-y-3">
                            {/* Tên sản phẩm */}
                            <div className="space-y-1">
                              <h4 className="line-clamp-2 font-medium leading-tight">{item.product.name}</h4>
                              <p className="text-sm text-muted-foreground">Người bán: {item.product.sellerName} </p>
                            </div>

                            {/* Variant selector - cho phép đổi variant */}
                            <CartVariantSelector item={item} onVariantChange={handleVariantChange} />

                            {/* Giá */}
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
                              {item.product.salePrice && item.product.salePrice < item.product.price && (
                                <span className="text-sm text-muted-foreground line-through">{formatPrice(item.product.price)}</span>
                              )}
                            </div>

                            {/* Quantity controls và remove button */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Button
                                  className="h-8 w-8 p-0"
                                  disabled={getItemQuantity(item.id) <= 1}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.id, getItemQuantity(item.id) - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  className="h-8 w-16 text-center"
                                  min="1"
                                  type="number"
                                  value={getItemQuantity(item.id)}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                />
                                <Button
                                  className="h-8 w-8 p-0"
                                  disabled={!item.variantAvailable || getItemQuantity(item.id) >= (item.variantStock || 0)}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.id, getItemQuantity(item.id) + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <Button className="h-8 w-8 p-0 text-destructive hover:text-destructive" size="sm" variant="ghost" onClick={() => handleRemoveItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Stock warning */}
                            {!item.variantAvailable && (
                              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2">
                                <X className="h-4 w-4 text-destructive" />
                                <span className="text-sm text-destructive">{t('Cart.outOfStock')}</span>
                                <Button className="ml-auto h-6 w-6 p-0" size="sm" variant="ghost" onClick={() => handleRemoveItem(item.id)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}

                            {/* Subtotal */}
                            <div className="flex justify-between text-sm">
                              <span>{t('Common.subtotal')}:</span>
                              <span className="font-medium">{formatPrice(item.subtotal)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('Common.quantity')}:</span>
                    <span>
                      {cart.totalItems} {t('Product.products')}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('Common.total')}:</span>
                    <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
                  </div>
                </div>

                <Button className="w-full" disabled={cart.totalItems === 0} size="lg" onClick={() => (window.location.href = PROTECTED_ROUTES.checkout.path())}>
                  {t('Cart.checkout')} ({cart.totalItems})
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
