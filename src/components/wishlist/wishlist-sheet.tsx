import type React from 'react';
import { useCallback, useState } from 'react';

import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

import { DEFAULT_IMG_AVATAR } from '~/constants';

import { useTranslation } from '~/hooks';

import { formatPrice } from '~/utils';

import { Button } from '~/components/common';
import { Card, CardContent, ScrollArea, Separator, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui';

import { useAddToCart } from '~/hooks/use-cart-mutation.hook';
import { useRemoveWishlistItemMutation } from '~/hooks/use-wishlist-mutation.hook';
import { useWishlistList } from '~/hooks/use-wishlist.hook';

interface WishlistSheetProps {
  children: React.ReactNode;
}

export const WishlistSheet = ({ children }: WishlistSheetProps): JSX.Element => {
  const { data: wishlistResponse, isLoading } = useWishlistList();
  const removeWishlistItem = useRemoveWishlistItemMutation();
  const addToCart = useAddToCart();
  const [isAddingAll, setIsAddingAll] = useState(false);
  const { t } = useTranslation();

  const wishlist = wishlistResponse?.result;

  const handleRemoveItem = (productId: string): void => {
    removeWishlistItem.mutate(productId);
  };

  const handleAddToCart = (productId: string): void => {
    addToCart.mutate(
      {
        productId,
        quantity: 1
      },
      {
        onSuccess: () => {
          removeWishlistItem.mutate(productId);
        }
      }
    );
  };

  const handleAddAllToCart = useCallback((): void => {
    if (!wishlist?.items || wishlist.items.length === 0) return;
    const availableItems = wishlist.items.filter((item) => item.product.stock > 0);

    if (availableItems.length === 0) {
      return;
    }

    setIsAddingAll(true);
    const addItemPromises = availableItems.map((item, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          addToCart.mutate(
            {
              productId: item.product.id,
              quantity: 1
            },
            {
              onSuccess: () => {
                removeWishlistItem.mutate(item.product.id, {
                  onSettled: () => {
                    resolve();
                  }
                });
              },
              onError: (error) => {
                console.error('Failed to add item to cart:', error);
                resolve();
              }
            }
          );
        }, index * 200);
      });
    });

    Promise.all(addItemPromises).finally(() => {
      setIsAddingAll(false);
    });
  }, [wishlist?.items, addToCart, removeWishlistItem]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">{children}</div>
      </SheetTrigger>

      <SheetContent className="!w-[500px] !max-w-none">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t('Wishlist.wishlistTitle')} ({wishlist?.totalItems || 0})
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
          ) : !wishlist || wishlist.items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">{t('Wishlist.emptyWishlist')}</p>
                <p className="text-muted-foreground">{t('Wishlist.emptyWishlistDesc')}</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="mt-6 flex-1">
                <div className="space-y-4">
                  {wishlist.items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <img alt={item.product.name} className="h-full w-full object-cover" src={item.product.defaultImageUrl || DEFAULT_IMG_AVATAR} />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="space-y-1">
                              <h4 className="line-clamp-2 font-medium leading-tight">{item.product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {t('Common.seller')}: {item.product.sellerName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">{formatPrice(item.product.salePrice || item.product.price)}</span>
                              {item.product.salePrice && item.product.salePrice < item.product.price && (
                                <span className="text-sm text-muted-foreground line-through">{formatPrice(item.product.price)}</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {t('Product.stockRemaining')}: {item.product.stock}
                              </span>
                              <span>
                                {t('Wishlist.addedDate')}: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <Button className="h-8 text-xs" disabled={addToCart.isPending || item.product.stock <= 0} size="sm" variant="outline" onClick={() => handleAddToCart(item.product.id)}>
                                <ShoppingCart className="mr-1 h-3 w-3" />
                                {item.product.stock <= 0 ? t('Product.outOfStock') : t('Cart.addToCart')}
                              </Button>

                              <Button
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                disabled={removeWishlistItem.isPending}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveItem(item.product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                    <span>{t('Wishlist.totalProducts')}:</span>
                    <span>
                      {wishlist.totalItems} {t('Product.products')}
                    </span>
                  </div>
                  <Separator />
                </div>

                <Button
                  className="w-full"
                  disabled={wishlist.totalItems === 0 || isAddingAll || !wishlist.items.some((item) => item.product.stock > 0)}
                  size="lg"
                  variant="outline"
                  onClick={handleAddAllToCart}
                >
                  {isAddingAll ? t('Wishlist.addingAll') : t('Wishlist.addAllToCart')}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
