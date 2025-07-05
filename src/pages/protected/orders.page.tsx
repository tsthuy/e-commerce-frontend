import { memo, useState } from 'react';

import { useTranslation } from '~/hooks';

import { Helmet } from '~/components/common';
import { CustomerOrdersTable } from '~/components/pages/customer/order';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui';

import { OrderStatus } from '../../types';

export const OrdersPage = memo(() => {
  const { t } = useTranslation();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | 'ALL'>('ALL');

  return (
    <Helmet title={t('Customer.myOrders')}>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">{t('Customer.myOrders')}</h1>

        <Tabs className="mb-6" defaultValue="all">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setCurrentStatus('ALL')}>
              {t('Common.all')}
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setCurrentStatus(OrderStatus.PENDING)}>
              {t('Order.processing')}
            </TabsTrigger>
            <TabsTrigger value="shipping" onClick={() => setCurrentStatus(OrderStatus.SHIPPED)}>
              {t('Order.shipped')}
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setCurrentStatus(OrderStatus.COMPLETED)}>
              {t('Order.completed')}
            </TabsTrigger>
            <TabsTrigger value="cancelled" onClick={() => setCurrentStatus(OrderStatus.CANCELLED)}>
              {t('Order.cancelled')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <CustomerOrdersTable
              initialFilters={{
                status: currentStatus === 'ALL' ? undefined : currentStatus
              }}
            />
          </TabsContent>

          <TabsContent value="pending">
            <CustomerOrdersTable initialFilters={{ status: OrderStatus.PENDING }} />
          </TabsContent>

          <TabsContent value="shipping">
            <CustomerOrdersTable initialFilters={{ status: OrderStatus.SHIPPED }} />
          </TabsContent>

          <TabsContent value="completed">
            <CustomerOrdersTable initialFilters={{ status: OrderStatus.COMPLETED }} />
          </TabsContent>

          <TabsContent value="cancelled">
            <CustomerOrdersTable initialFilters={{ status: OrderStatus.CANCELLED }} />
          </TabsContent>
        </Tabs>
      </div>
    </Helmet>
  );
});

OrdersPage.displayName = 'OrdersPage';
