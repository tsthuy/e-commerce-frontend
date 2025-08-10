import { memo } from 'react';

import { MessageCircle } from 'lucide-react';

import { DEFAULT_IMG_SAMPLE } from '~/constants';

import type { OrderResponse, OrderStatus } from '~/types';

import { cn } from '~/libs';

import { useTranslation } from '~/hooks';

import { formatDate, formatPrice } from '~/utils';

import { Badge, Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui';

import { ProductReviewSection } from './product-review-section';

import { useProfile } from '~/hooks/use-profile.hook';

interface CustomerOrderDetailDialogProps {
  order: OrderResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerOrderDetailDialog = memo<CustomerOrderDetailDialogProps>(({ order, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { data: profileResponse } = useProfile({ enabled: true });

  if (!order) return null;

  const handleMessageSeller = (): void => {
    if (!order.sellerId || !profileResponse?.id) return;

    const customerId = profileResponse.id;
    const sellerId = order.sellerId;
    const conversationId = `${customerId}_${sellerId}`;
    window.location.href = `/user/messages/conversation/${conversationId}`;
  };

  const getStatusBadge = (status: OrderStatus): JSX.Element => {
    const statusConfig = {
      PENDING: { label: t('CustomerOrderDialog.pending'), color: 'warning' },
      CONFIRMED: { label: t('CustomerOrderDialog.confirmed'), color: 'info' },
      PROCESSING: { label: t('CustomerOrderDialog.processing'), color: 'info' },
      SHIPPED: { label: t('CustomerOrderDialog.shipped'), color: 'primary' },
      DELIVERED: { label: t('CustomerOrderDialog.delivered'), color: 'success' },
      COMPLETED: { label: t('CustomerOrderDialog.completed'), color: 'success' },
      CANCELLED: { label: t('CustomerOrderDialog.cancelled'), color: 'danger' },
      REFUNDED: { label: t('CustomerOrderDialog.refunded'), color: 'warning' }
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Badge>{config.label}</Badge>;
  };

  const canReview = order.status === 'COMPLETED';

  const groupedItems = order.items.reduce(
    (acc, item) => {
      const existingGroup = acc.find((group) => group.productId === item.productId);
      if (existingGroup) {
        existingGroup.items.push(item);
        existingGroup.totalQuantity += item.quantity;
      } else {
        acc.push({
          productId: item.productId,
          productName: item.productName,
          productImageUrl: item.productImageUrl,
          variantImageUrl: item.variantImageUrl,
          items: [item],
          totalQuantity: item.quantity
        });
      }
      return acc;
    },
    [] as Array<{
      productId: string;
      productName: string;
      productImageUrl?: string;
      variantImageUrl?: string;
      items: typeof order.items;
      totalQuantity: number;
    }>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t('CustomerOrderDialog.orderDetails')} - #{order.orderNumber}
          </DialogTitle>
          <DialogDescription>
            {t('CustomerOrderDialog.orderPlacedOn')} {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('CustomerOrderDialog.status')}</h3>
            {getStatusBadge(order.status)}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-2 font-semibold">{t('CustomerOrderDialog.customer')}</h4>
                <p className="text-sm">{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.customerEmail}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-2 font-semibold">{t('CustomerOrderDialog.seller')}</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{order.sellerShopName}</p>
                    <p className="text-sm text-gray-600">{order.sellerName}</p>
                  </div>
                  <Button className="h-8 w-8 p-0 text-gray-500 hover:text-primary" size="sm" variant="ghost" onClick={handleMessageSeller}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-2 font-semibold">{t('CustomerOrderDialog.shippingAddress')}</h4>
              <p className="text-sm">
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </CardContent>
          </Card>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('CustomerOrderDialog.items')}</h3>
            <div className="space-y-4">
              {groupedItems.map((group) => (
                <Card key={group.productId}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="mt-2 space-y-2">
                          {group.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="">
                                {(item.variantImageUrl || group.productImageUrl) && (
                                  <img alt={group.productName} className="h-16 w-16 rounded object-cover" src={item.variantImageUrl || group.productImageUrl || DEFAULT_IMG_SAMPLE} />
                                )}
                              </div>

                              <div className="">
                                <h4 className="font-semibold">{group.productName}</h4>

                                {item.variantName && <span className="font-medium">{item.variantName}</span>}

                                <span className={cn(item.variantName != null && 'ml-2')}>
                                  {t('CustomerOrderDialog.quantity')}: {item.quantity} × {formatPrice(item.unitPrice)} = {formatPrice(item.subtotal)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 font-semibold">
                          {t('CustomerOrderDialog.total')}: {formatPrice(group.items.reduce((sum, item) => sum + item.subtotal, 0))}
                        </div>

                        {canReview && <ProductReviewSection orderId={order.id} productId={group.productId} productName={group.productName} onReviewSuccess={() => {}} />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="mb-4 font-semibold">{t('CustomerOrderDialog.orderTotal')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('CustomerOrderDialog.subtotal')}:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('CustomerOrderDialog.shippingFee')}:</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('CustomerOrderDialog.tax')}:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span>{t('Common.discount')}:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                  <span>{t('CustomerOrderDialog.total')}:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-2 font-semibold">{t('Order.orderNotes')}</h4>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

CustomerOrderDetailDialog.displayName = 'CustomerOrderDetailDialog';
