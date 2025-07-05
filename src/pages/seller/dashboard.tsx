import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Container, Helmet } from '~/components/common';

export const Dashboard = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={t('Seller.sellerDashboard')}>
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('Seller.dashboardOverview')}</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title={t('Seller.totalSales')} value="$24,560" />
          <DashboardCard title={t('Seller.totalOrders')} value="345" />
          <DashboardCard title={t('Seller.totalProducts')} value="132" />
        </div>
        {/* Add more dashboard content here */}
      </Container>
    </Helmet>
  );
});

const DashboardCard = memo(({ title, value }: { title: string; value: string }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
});
