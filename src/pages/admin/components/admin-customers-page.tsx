import { memo } from 'react';

import { useTranslation } from 'react-i18next';

import { SEO_AUTHOR } from '~/constants';

import { AdminCustomersTable } from '~/components/admin/admin-customers-table';
import { Helmet } from '~/components/common';

export const AdminCustomersPage = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={`${t('Admin.customers.allCustomersTitle')} - Admin - ${SEO_AUTHOR}`}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Admin.customers.allCustomersTitle')}</h1>
          <p className="mt-1 text-sm text-gray-600">{t('Admin.customers.allCustomersSubtitle')}</p>
        </div>

        <AdminCustomersTable />
      </div>
    </Helmet>
  );
});

AdminCustomersPage.displayName = 'AdminCustomersPage';
