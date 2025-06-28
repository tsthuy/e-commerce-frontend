import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const Dashboard = memo(() => {
  return (
    <Helmet title="Seller Dashboard">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="Total Sales" value="$24,560" />
          <DashboardCard title="Total Orders" value="345" />
          <DashboardCard title="Total Products" value="132" />
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
