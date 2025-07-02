import { memo, useState } from 'react';

import { CalendarClock, ShoppingBag } from 'lucide-react';
import { useHistory } from 'react-router-dom';

import { formatDate, formatPrice } from '~/utils';

import { Button, Helmet, SpinnerLineSpinner } from '~/components/common';
import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui';

import { useCustomerOrders } from '~/hooks/use-order.hook';
import { PROTECTED_ROUTES } from '~/routes/protected.route';
import type { OrderStatus } from '~/types/order';

export const OrdersPage = memo(() => {
  const { push } = useHistory();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data: orderData, isLoading } = useCustomerOrders({
    data: {
      page: currentPage,
      size: 10,
      status: currentStatus === 'ALL' ? undefined : currentStatus,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    }
  });

  const handleGoToCheckout = () => {
    push(PROTECTED_ROUTES.checkout.path());
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { label: 'Đang xử lý', color: 'warning' },
      CONFIRMED: { label: 'Đã xác nhận', color: 'success' },
      PROCESSING: { label: 'Đang chuẩn bị', color: 'info' },
      SHIPPED: { label: 'Đang giao hàng', color: 'info' },
      DELIVERED: { label: 'Đã giao hàng', color: 'success' },
      COMPLETED: { label: 'Hoàn thành', color: 'success' },
      CANCELLED: { label: 'Đã hủy', color: 'danger' },
      REFUNDED: { label: 'Đã hoàn tiền', color: 'warning' }
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Badge color={config.color as any}>{config.label}</Badge>;
  };

  return (
    <Helmet title="Đơn hàng của tôi">
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Đơn hàng của tôi</h1>

        <Tabs className="mb-6" defaultValue="all">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setCurrentStatus('ALL')}>
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setCurrentStatus('PENDING')}>
              Đang xử lý
            </TabsTrigger>
            <TabsTrigger value="shipping" onClick={() => setCurrentStatus('SHIPPED')}>
              Đang giao
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setCurrentStatus('COMPLETED')}>
              Hoàn thành
            </TabsTrigger>
            <TabsTrigger value="cancelled" onClick={() => setCurrentStatus('CANCELLED')}>
              Đã hủy
            </TabsTrigger>
          </TabsList>

          <TabsContent className="pt-4" value="all">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <SpinnerLineSpinner />
              </div>
            ) : !orderData?.result?.content || orderData.result.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-10 text-center shadow">
                <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-medium">Không tìm thấy đơn hàng nào</h2>
                <p className="mb-6 text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
                <Button onClick={handleGoToCheckout}>Mua sắm ngay</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orderData.result.content.map((order) => (
                  <div key={order.id} className="rounded-lg border bg-white shadow">
                    <div className="flex items-center justify-between border-b p-4">
                      <div>
                        <p className="font-medium">Đơn hàng #{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          <CalendarClock className="mr-1 inline-block h-4 w-4" />
                          Đặt ngày {formatDate(order.createdAt)}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="p-4">
                      <p className="mb-2 font-medium">Người bán: {order.sellerShopName}</p>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-gray-50">
                              <img alt={item.productName} className="h-full w-full object-cover" src={item.productImageUrl} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.productName}</p>
                              {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                              <p className="text-sm">
                                {formatPrice(item.unitPrice)} x {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">{formatPrice(item.subtotal)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p>Tổng tiền ({order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm):</p>
                          <p className="text-muted-foreground">Phí vận chuyển: {formatPrice(order.shippingFee)}</p>
                        </div>
                        <div className="text-lg font-medium text-primary">{formatPrice(order.total)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent className="pt-4" value="pending">
            {/* Content will be loaded through the status filter */}
          </TabsContent>

          <TabsContent className="pt-4" value="shipping">
            {/* Content will be loaded through the status filter */}
          </TabsContent>

          <TabsContent className="pt-4" value="completed">
            {/* Content will be loaded through the status filter */}
          </TabsContent>

          <TabsContent className="pt-4" value="cancelled">
            {/* Content will be loaded through the status filter */}
          </TabsContent>
        </Tabs>
      </div>
    </Helmet>
  );
});
