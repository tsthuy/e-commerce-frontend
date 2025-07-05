import { memo, useState } from 'react';

import { useTranslation } from '~/hooks';

import { Container, Helmet } from '~/components/common';
import { OrdersTable } from '~/components/pages/seller/order';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui';

import { OrderStatus } from '../../types';

export const AllNewOrders = memo(() => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const { t } = useTranslation();

  return (
    <Helmet title={t('Order.orders')}>
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('Order.orders')}</h1>

        <Tabs className="mb-6" defaultValue="all">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setCurrentStatus('ALL')}>
              {t('Common.all')}
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setCurrentStatus(OrderStatus.PENDING)}>
              {t('Order.pending')}
            </TabsTrigger>
            <TabsTrigger value="confirmed" onClick={() => setCurrentStatus(OrderStatus.CONFIRMED)}>
              {t('Order.confirmed')}
            </TabsTrigger>
            <TabsTrigger value="processing" onClick={() => setCurrentStatus(OrderStatus.PROCESSING)}>
              {t('Order.processing')}
            </TabsTrigger>
            <TabsTrigger value="shipped" onClick={() => setCurrentStatus(OrderStatus.SHIPPED)}>
              {t('Order.shipped')}
            </TabsTrigger>
            <TabsTrigger value="delivered" onClick={() => setCurrentStatus(OrderStatus.DELIVERED)}>
              {t('Order.delivered')}
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setCurrentStatus(OrderStatus.COMPLETED)}>
              {t('Order.completed')}
            </TabsTrigger>
            <TabsTrigger value="cancelled" onClick={() => setCurrentStatus(OrderStatus.CANCELLED)}>
              {t('Order.cancelled')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <OrdersTable
              initialFilters={{
                status: currentStatus === 'ALL' ? undefined : currentStatus
              }}
            />
          </TabsContent>

          <TabsContent value="pending">
            <OrdersTable initialFilters={{ status: OrderStatus.PENDING }} />
          </TabsContent>

          <TabsContent value="confirmed">
            <OrdersTable initialFilters={{ status: OrderStatus.CONFIRMED }} />
          </TabsContent>

          <TabsContent value="processing">
            <OrdersTable initialFilters={{ status: OrderStatus.PROCESSING }} />
          </TabsContent>

          <TabsContent value="shipped">
            <OrdersTable initialFilters={{ status: OrderStatus.SHIPPED }} />
          </TabsContent>

          <TabsContent value="delivered">
            <OrdersTable initialFilters={{ status: OrderStatus.DELIVERED }} />
          </TabsContent>

          <TabsContent value="completed">
            <OrdersTable initialFilters={{ status: OrderStatus.COMPLETED }} />
          </TabsContent>

          <TabsContent value="cancelled">
            <OrdersTable initialFilters={{ status: OrderStatus.CANCELLED }} />
          </TabsContent>
        </Tabs>
      </Container>
    </Helmet>
  );
});
