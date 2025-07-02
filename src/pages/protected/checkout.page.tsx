import React, { memo, useCallback, useState } from 'react';

import { Building, CreditCard, MapPin, PackageOpen, Truck } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';

import { formatPrice } from '~/utils';

import { Button, Helmet, SpinnerLineSpinner } from '~/components/common';
import { AddressSelector, OrderSummary, PaymentMethodSelector } from '~/components/pages/protected/checkout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator, Textarea } from '~/components/ui';

import { useCartList } from '~/hooks/use-cart.hook';
import { useProfile } from '~/hooks/use-profile.hook';
import { useCreateOrderMutation } from '~/queries/order.mutation';
import { PROTECTED_ROUTES } from '~/routes/protected.route';
import type { CreateOrderRequest, PaymentMethod } from '~/types/order';

export const CheckoutPage = memo(() => {
  const { push } = useHistory();
  const { data: profile, isLoading: profileLoading } = useProfile({});
  const { data: cartResponse, isLoading: cartLoading } = useCartList();
  const createOrder = useCreateOrderMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [notes, setNotes] = useState<string>('');

  // When profile loads, set default address if available
  React.useEffect(() => {
    if (profile?.addresses && profile.addresses.length > 0) {
      // Find default address or use the first one
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
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

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
  }, [selectedAddressId, paymentMethod, notes, createOrder, push]);

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
          <h2 className="mb-2 text-2xl font-semibold">Giỏ hàng trống</h2>
          <p className="mb-6 text-center text-muted-foreground">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Button onClick={() => push('/')}>Tiếp tục mua sắm</Button>
        </div>
      </div>
    );
  }

  return (
    <Helmet title="Thanh toán">
      <div className="container py-8">
        <h1 className="mb-6 text-2xl font-bold">Thanh toán</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Shipping & Payment */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
                <CardDescription>Chọn địa chỉ nhận hàng của bạn</CardDescription>
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
                  Phương thức thanh toán
                </CardTitle>
                <CardDescription>Chọn phương thức thanh toán phù hợp</CardDescription>
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
                  Đơn hàng của bạn
                </CardTitle>
                <CardDescription>Sản phẩm từ các người bán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Group items by seller */}
                {Array.from(new Set(cart.items.map((item) => item.product.sellerId))).map((sellerId) => {
                  const sellerItems = cart.items.filter((item) => item.product.sellerId === sellerId);
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
                              {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
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
                          Phí vận chuyển
                        </span>
                        <span>Miễn phí</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú đơn hàng</CardTitle>
                <CardDescription>Nhập ghi chú cho người bán hoặc người giao hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea className="h-24" placeholder="Nhập ghi chú cho đơn hàng của bạn (không bắt buộc)" value={notes} onChange={handleNotesChange} />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Tổng đơn hàng</CardTitle>
                <CardDescription>Thông tin đơn hàng của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderSummary cart={cart} />
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tổng sản phẩm:</span>
                    <span>{cart.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={!selectedAddressId || createOrder.isPending} isLoading={createOrder.isPending} size="lg" onClick={handlePlaceOrder}>
                  Đặt hàng
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Helmet>
  );
});
