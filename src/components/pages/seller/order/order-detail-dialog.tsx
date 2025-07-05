import { memo } from 'react';

import type { OrderResponse } from '~/types';

import { useTranslation } from '~/hooks';

import { formatDate, formatPrice } from '~/utils';

import { Badge, Dialog, DialogContent, DialogHeader, DialogTitle, ScrollArea } from '~/components/ui';

interface OrderDetailDialogProps {
  order: OrderResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailDialog = memo<OrderDetailDialogProps>(({ order, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!order) return null;

  const getStatusBadge = (status: string): JSX.Element => {
    const statusConfig = {
      PENDING: { label: t('Order.pending'), color: 'warning' },
      CONFIRMED: { label: t('Order.confirmed'), color: 'info' },
      PROCESSING: { label: t('Order.processing'), color: 'info' },
      SHIPPED: { label: t('Order.shipped'), color: 'primary' },
      DELIVERED: { label: t('Order.delivered'), color: 'success' },
      COMPLETED: { label: t('Order.completed'), color: 'success' },
      CANCELLED: { label: t('Order.cancelled'), color: 'danger' },
      REFUNDED: { label: t('Order.refunded'), color: 'warning' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'default' };
    return <Badge color={config.color as 'warning' | 'info' | 'primary' | 'success' | 'danger' | 'default'}>{config.label}</Badge>;
  };

  const getPaymentMethodBadge = (method: string): JSX.Element => {
    const methodConfig = {
      CASH_ON_DELIVERY: { label: t('Checkout.cashOnDelivery'), color: 'warning' },
      CREDIT_CARD: { label: t('Checkout.creditCard'), color: 'primary' },
      BANK_TRANSFER: { label: t('Checkout.bankTransfer'), color: 'info' },
      E_WALLET: { label: t('Checkout.eWallet'), color: 'success' }
    };

    const config = methodConfig[method as keyof typeof methodConfig] || { label: method, color: 'default' };
    return (
      <Badge color={config.color as 'warning' | 'primary' | 'info' | 'success' | 'default'} variant="outline">
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>
              {t('Order.orderDetails')} #{order.orderNumber}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)] p-6 pt-0">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{t('Order.orderInfo')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Order.orderNumber')}:</span>
                      <span className="font-mono">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Order.orderStatus')}:</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Order.orderDate')}:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Order.orderTotal')}:</span>
                      <span className="font-semibold text-green-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">{t('Order.orderPayment')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Checkout.paymentMethod')}:</span>
                      {getPaymentMethodBadge(order.paymentMethod)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Common.status')}:</span>
                      <span>{order.paymentStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{t('Order.orderCustomer')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Common.name')}:</span>
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Common.email')}:</span>
                      <span>{order.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Common.phone')}:</span>
                      <span>{order.shippingAddress?.recipientPhone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">{t('Checkout.shippingAddress')}</h3>
                  <div className="text-sm">
                    <p>{order.shippingAddress?.recipientPhone}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>{order.shippingAddress?.city}</p>
                    <p>{order.shippingAddress?.country}</p>
                    {order.shippingAddress?.zipCode && <p>{order.shippingAddress.zipCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                {t('Product.products')} ({order.items?.length || 0})
              </h3>
              <div className="overflow-hidden rounded-lg border">
                <div className="bg-muted px-4 py-3">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                    <div className="col-span-6">{t('Product.product')}</div>
                    <div className="col-span-2 text-center">{t('Common.price')}</div>
                    <div className="col-span-2 text-center">{t('Common.quantity')}</div>
                    <div className="col-span-2 text-right">{t('Common.subtotal')}</div>
                  </div>
                </div>
                <div className="divide-y">
                  {order.items?.map((item, index) => (
                    <div key={index} className="px-4 py-4">
                      <div className="grid grid-cols-12 items-center gap-4">
                        <div className="col-span-6">
                          <div className="flex items-center gap-3">
                            {item.productImageUrl && <img alt={item.productName} className="h-12 w-12 rounded object-cover" src={item.productImageUrl} />}
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-muted-foreground">SKU: {item.productSku}</p>
                              {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">{formatPrice(item.unitPrice)}</div>
                        <div className="col-span-2 text-center">{item.quantity}</div>
                        <div className="col-span-2 text-right font-medium">{formatPrice(item.subtotal)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between">
                    <span>{t('Common.subtotal')}:</span>
                    <span>{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Common.shipping')}:</span>
                    <span>{formatPrice(order.shippingFee || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Common.discount')}:</span>
                    <span>-{formatPrice(order.discount || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                    <span>{t('Common.total')}:</span>
                    <span className="text-green-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div>
                <h3 className="mb-2 text-lg font-semibold">{t('Order.orderNotes')}</h3>
                <div className="rounded-lg bg-muted p-3">
                  <p className="whitespace-pre-wrap text-sm">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

OrderDetailDialog.displayName = 'OrderDetailDialog';
