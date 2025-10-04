import { useTranslation } from 'react-i18next';

import { AdminSellersTable } from '~/components/admin/admin-sellers-table';

export const AdminSellersPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('Admin.sellers.sellersManagementTitle')}</h1>
          <p className="text-muted-foreground">{t('Admin.sellers.sellersManagementSubtitle')}</p>
        </div>
      </div>

      <AdminSellersTable />
    </div>
  );
};
