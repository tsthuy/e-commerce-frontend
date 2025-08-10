import { memo } from 'react';

import { useTranslation } from 'react-i18next';

import { SEO_AUTHOR } from '~/constants';

import { AdminOrdersTable } from '~/components/admin/admin-orders-table';
import { Helmet } from '~/components/common';

export const AdminAllOrdersPage = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={`${t('Admin.orders.allOrdersTitle')} - Admin - ${SEO_AUTHOR}`}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Admin.orders.allOrdersTitle')}</h1>
          <p className="mt-1 text-sm text-gray-600">{t('Admin.orders.allOrdersSubtitle')}</p>
        </div>

        <AdminOrdersTable />
      </div>
    </Helmet>
  );
});

AdminAllOrdersPage.displayName = 'AdminAllOrdersPage';
