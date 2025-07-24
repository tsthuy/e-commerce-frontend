import { memo } from 'react';

import { MessageCircle } from 'lucide-react';

import { DEFAULT_IMG_SAMPLE } from '~/constants';

import type { OrderResponse, OrderStatus } from '~/types';

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
  const { data: profileResponse } = useProfile({ enabled: true });

  if (!order) return null;

  const handleMessageSeller = (): void => {
    if (!order.sellerId || !profileResponse?.id) return;

    const customerId = profileResponse.id;
    const sellerId = order.sellerId;
    const conversationId = `${customerId}_${sellerId}`;

    // Navigate to conversation page
    window.location.href = `/user/messages/conversation/${conversationId}`;
  };

  const getStatusBadge = (status: OrderStatus): JSX.Element => {
    const statusConfig = {
      PENDING: { label: 'Pending', color: 'warning' },
      CONFIRMED: { label: 'Confirmed', color: 'info' },
      PROCESSING: { label: 'Processing', color: 'info' },
      SHIPPED: { label: 'Shipped', color: 'primary' },
      DELIVERED: { label: 'Delivered', color: 'success' },
      COMPLETED: { label: 'Completed', color: 'success' },
      CANCELLED: { label: 'Cancelled', color: 'danger' },
      REFUNDED: { label: 'Refunded', color: 'warning' }
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Badge>{config.label}</Badge>;
  };

  const canReview = order.status === 'COMPLETED';

  // Group items by product (to handle multiple variants of same product)
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
          <DialogTitle>Order Details - #{order.orderNumber}</DialogTitle>
          <DialogDescription>Order placed on {formatDate(order.createdAt)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Status</h3>
            {getStatusBadge(order.status)}
          </div>

          {/* Customer & Seller Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-2 font-semibold">Customer</h4>
                <p className="text-sm">{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.customerEmail}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-2 font-semibold">Seller</h4>
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

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-2 font-semibold">Shipping Address</h4>
              <p className="text-sm">
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </CardContent>
          </Card>

          {/* Order Items - Grouped by Product */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Items</h3>
            <div className="space-y-4">
              {groupedItems.map((group) => (
                <Card key={group.productId}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {group.variantImageUrl && <img alt={group.productName} className="h-16 w-16 rounded object-cover" src={group.variantImageUrl || group.productImageUrl || DEFAULT_IMG_SAMPLE} />}
                      <div className="flex-1">
                        <h4 className="font-semibold">{group.productName}</h4>

                        {/* Show all variants for this product */}
                        <div className="mt-2 space-y-1">
                          {group.items.map((item) => (
                            <div key={item.id} className="text-sm text-gray-600">
                              {item.variantName && <span className="font-medium">{item.variantName}</span>}

                              <span className="ml-2">
                                Qty: {item.quantity} × {formatPrice(item.unitPrice)} = {formatPrice(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total for this product */}
                        <div className="mt-2 font-semibold">Total: {formatPrice(group.items.reduce((sum, item) => sum + item.subtotal, 0))}</div>

                        {/* Review Section - Only if order is completed */}
                        {canReview && (
                          <ProductReviewSection
                            orderId={order.id}
                            productId={group.productId}
                            productName={group.productName}
                            onReviewSuccess={() => {
                              // Optionally refresh data or show success message
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h4 className="mb-4 font-semibold">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-2 font-semibold">Notes</h4>
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
