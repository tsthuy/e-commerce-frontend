import React, { memo, useCallback, useState } from 'react';

import { Building, CreditCard, MapPin, PackageOpen, Truck } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';

import { httpBase } from '~/services';

import { formatPrice } from '~/utils';

import { Button, Helmet, SpinnerLineSpinner } from '~/components/common';
import { AddressSelector, OrderSummary, PaymentMethodSelector } from '~/components/pages/protected/checkout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator, Textarea } from '~/components/ui';

import { useCartList } from '~/hooks/use-cart.hook';
import { useProfile } from '~/hooks/use-profile.hook';
import { useTranslation } from '~/hooks/use-translation.hook';
import { useCreateOrderMutation } from '~/queries/order.mutation';
import { PROTECTED_ROUTES } from '~/routes/protected.route';
import type { CreateOrderRequest } from '~/types/order';
import { PaymentMethod } from '~/types/order';

export const CheckoutPage = memo(() => {
  const { push } = useHistory();
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading } = useProfile({});
  const { data: cartResponse, isLoading: cartLoading } = useCartList();
  const createOrder = useCreateOrderMutation();
  const [isOrderCreating, setIsOrderCreating] = useState<boolean>(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH_ON_DELIVERY);
  const [notes, setNotes] = useState<string>('');

  React.useEffect(() => {
    if (profile?.addresses && profile.addresses.length > 0) {
      const defaultAddress = profile.addresses.find((addr) => addr.isDefault) || profile.addresses[0];
      if (defaultAddress?.id) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [profile]);

  const handleAddressChange = useCallback((addressId: string) => {
    setSelectedAddressId(addressId);
  }, []);

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
  }, []);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  }, []);

  const handlePlaceOrder = useCallback(() => {
    if (!selectedAddressId) {
      toast.error(t('Checkout.selectAddress'));
      return;
    }

    if (paymentMethod === PaymentMethod.ADVANCE_PAYMENT) {
      const stripeCheckoutData = {
        shippingAddressId: selectedAddressId,
        notes: notes.trim() || undefined
      };
      setIsOrderCreating(true);

      httpBase
        .post('/api/stripe/create-checkout-session', stripeCheckoutData)
        .then((response) => {
          window.location.href = (response.data as { url: string }).url;
        })
        .catch((error) => {
          toast.error(t('Checkout.paymentError'));
          console.error('Error creating checkout session:', error);
        });
      setIsOrderCreating(false);
    } else {
      const orderData: CreateOrderRequest = {
        shippingAddressId: selectedAddressId,
        paymentMethod,
        notes: notes.trim() || undefined
      };

      createOrder.mutate(orderData, {
        onSuccess: () => {
          push(PROTECTED_ROUTES.orders.path());
        }
      });
    }
  }, [selectedAddressId, paymentMethod, notes, createOrder, push, t]);

  if (profileLoading || cartLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <SpinnerLineSpinner />
      </div>
    );
  }

  const cart = cartResponse?.result;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-10 shadow">
          <PackageOpen className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold">{t('Checkout.emptyCart')}</h2>
          <p className="mb-6 text-center text-muted-foreground">{t('Checkout.emptyCartMessage')}</p>
          <Button onClick={() => push('/')}>{t('Checkout.continueShopping')}</Button>
        </div>
      </div>
    );
  }

  return (
    <Helmet title={t('Checkout.title')}>
      <div className="container py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('Checkout.title')}</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Shipping & Payment */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('Checkout.shippingAddress')}
                </CardTitle>
                <CardDescription>{t('Checkout.selectShippingAddress')}</CardDescription>
              </CardHeader>
              <CardContent>
                <AddressSelector addresses={profile?.addresses || []} selectedAddressId={selectedAddressId} onSelectAddress={handleAddressChange} />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t('Checkout.paymentMethod')}
                </CardTitle>
                <CardDescription>{t('Checkout.selectPaymentMethod')}</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelector selectedMethod={paymentMethod} onSelectMethod={handlePaymentMethodChange} />
              </CardContent>
            </Card>

            {/* Sellers & Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('Checkout.yourOrder')}
                </CardTitle>
                <CardDescription>{t('Checkout.productsFromSellers')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Group items by seller */}
                {Array.from(new Set(cart.items.map((item) => item.product.sellerName))).map((sellerId) => {
                  const sellerItems = cart.items.filter((item) => item.product.sellerName === sellerId);
                  const sellerName = sellerItems[0]?.product.sellerName || 'Unknown Seller';

                  return (
                    <div key={sellerId} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="font-medium">{sellerName}</span>
                      </div>
                      <div className="space-y-3">
                        {sellerItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded border bg-gray-50">
                              <img alt={item.product.name} className="h-full w-full object-cover" src={item.variantImage || item.product.defaultImageUrl} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="line-clamp-1">{item.product.name}</p>
                              {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}
                              <p className="text-sm">
                                <span className="font-medium text-primary">{formatPrice(item.price)}</span>
                                <span className="text-muted-foreground"> x {item.quantity}</span>
                              </p>
                            </div>
                            <div className="text-right font-medium">{formatPrice(item.subtotal)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between border-t pt-3">
                        <span className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          {t('Checkout.shippingFee')}
                        </span>
                        <span>{t('Checkout.free')}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>{t('Checkout.orderNotes')}</CardTitle>
                <CardDescription>{t('Checkout.orderNotesDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea className="h-24" placeholder={t('Checkout.orderNotesPlaceholder')} value={notes} onChange={handleNotesChange} />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>{t('Checkout.orderTotal')}</CardTitle>
                <CardDescription>{t('Checkout.orderInfo')}</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderSummary cart={cart} />
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('Checkout.totalItems')}</span>
                    <span>{cart.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Checkout.subtotal')}</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Checkout.shipping')}</span>
                    <span>{t('Checkout.free')}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('Checkout.totalPayment')}</span>
                  <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={!selectedAddressId || createOrder.isPending || isOrderCreating} isLoading={createOrder.isPending} size="lg" onClick={handlePlaceOrder}>
                  {t('Checkout.placeOrder')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Helmet>
  );
});
