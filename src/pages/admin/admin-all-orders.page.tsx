import { memo } from 'react';

import { SEO_AUTHOR } from '~/constants';

import { AdminOrdersTable } from '~/components/admin/admin-orders-table';
import { Helmet } from '~/components/common';

export const AdminAllOrdersPage = memo(() => {
  return (
    <Helmet title={`All Orders - Admin - ${SEO_AUTHOR}`}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
          <p className="mt-1 text-sm text-gray-600">Monitor and manage all orders across the platform</p>
        </div>

        <AdminOrdersTable />
      </div>
    </Helmet>
  );
});

AdminAllOrdersPage.displayName = 'AdminAllOrdersPage';
