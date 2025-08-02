import { memo, useState } from 'react';

import { DollarSignIcon, PackageIcon, ShoppingCartIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useTranslation } from '~/hooks';

import { DashboardCard } from '~/components/dashboard/dashboard-card';
import { PeriodSelector } from '~/components/dashboard/period-selector';

import { useDashboardChart, useDashboardStats } from '~/hooks/use-dashboard.hook';
import type { ChartType, PeriodType } from '~/types/dashboard';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const SellerDashboard = memo(() => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('7days');
  const { t } = useTranslation();

  // Determine chart type based on selected period
  const getChartType = (period: PeriodType): ChartType => {
    switch (period) {
      case 'today':
      case '3days':
      case '7days':
        return 'daily';
      case '1month':
        return 'weekly';
      case '1quarter':
        return '2weekly'; // Bi-weekly for 3 months
      case '6months':
        return 'monthly';
      case '1year':
        return 'monthly';
      case 'all':
        // If current year > 2025 + 1 year, use yearly, otherwise monthly
        const currentYear = new Date().getFullYear();
        return currentYear > 2026 ? 'yearly' : 'monthly';
      default:
        return 'monthly';
    }
  };

  const { data: statsData, isLoading: statsLoading } = useDashboardStats({
    data: { period: selectedPeriod }
  });
  const { data: chartData, isLoading: chartLoading } = useDashboardChart({
    data: { period: selectedPeriod, type: getChartType(selectedPeriod) }
  });

  // Extract stats from response
  const stats = statsData?.result;
  const chart = chartData?.result;

  if (statsLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('Seller.dashboard')}</h1>
        <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon={<DollarSignIcon className="h-4 w-4" color="green" />}
            subtitle={t('Seller.readyForWithdrawal')}
            title={t('Seller.availableAmount')}
            value={formatCurrency(stats.availableAmount)}
          />
          <DashboardCard
            icon={<DollarSignIcon className="h-4 w-4" color="green" />}
            subtitle={`${stats.completedOrders} ${t('Seller.completedOrders')}`}
            title={t('Seller.totalRevenue')}
            value={formatCurrency(stats.totalRevenue)}
          />
          <DashboardCard
            icon={<ShoppingCartIcon className="h-4 w-4" color="purple" />}
            subtitle={`${stats.cancelledOrders} ${t('Seller.cancelled')}`}
            title={t('Seller.totalOrders')}
            value={stats.totalOrders}
          />
          <DashboardCard icon={<PackageIcon className="h-4 w-4" color="orange" />} subtitle={t('Seller.activeListings')} title={t('Seller.products')} value={stats.totalProducts} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">{t('Seller.revenueTrend')}</h3>
          {chartLoading ? (
            <div className="h-64 animate-pulse rounded bg-gray-200" />
          ) : (
            <ResponsiveContainer height={300} width="100%">
              <LineChart data={chart?.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), t('Seller.totalRevenue')]} />
                <Line dataKey="revenue" stroke="#3B82F6" strokeWidth={2} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">{t('Seller.ordersOverview')}</h3>
          {chartLoading ? (
            <div className="h-64 animate-pulse rounded bg-gray-200" />
          ) : (
            <ResponsiveContainer height={300} width="100%">
              <BarChart data={chart?.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completedOrders" fill="#10B981" name={t('Seller.completed')} />
                <Bar dataKey="cancelledOrders" fill="#EF4444" name={t('Common.cancelled')} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard subtitle={t('Seller.perCompletedOrder')} title={t('Seller.averageOrderValue')} value={formatCurrency(stats.avgOrderValue)} />
          <DashboardCard
            subtitle={`${stats.completedOrders} ${t('Seller.ordersOf')} ${stats.totalOrders} ${t('Seller.orders')}`}
            title={t('Seller.completionRate')}
            value={`${stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%`}
          />
          <DashboardCard subtitle={t('Seller.platformFee')} title={t('Seller.commissionFee')} value={formatCurrency(stats.totalRevenue * 0.1)} />
        </div>
      )}
    </div>
  );
});
