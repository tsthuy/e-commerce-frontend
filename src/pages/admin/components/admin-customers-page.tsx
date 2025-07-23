import { memo } from 'react';

import { SEO_AUTHOR } from '~/constants';

import { AdminCustomersTable } from '~/components/admin/admin-customers-table';
import { Helmet } from '~/components/common';

export const AdminCustomersPage = memo(() => {
  return (
    <Helmet title={`All Customers - Admin - ${SEO_AUTHOR}`}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Customers</h1>
          <p className="mt-1 text-sm text-gray-600">View and manage customer accounts across the platform</p>
        </div>

        <AdminCustomersTable />
      </div>
    </Helmet>
  );
});

AdminCustomersPage.displayName = 'AdminCustomersPage';
