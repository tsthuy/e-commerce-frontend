import { memo, useState } from 'react';

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

export default memo(() => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('7days');

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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard subtitle="Ready for withdrawal" title="Available Amount" value={formatCurrency(stats.availableAmount)} />
          <DashboardCard subtitle={`${stats.completedOrders} completed orders`} title="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
          <DashboardCard subtitle={`${stats.cancelledOrders} cancelled`} title="Total Orders" value={stats.totalOrders} />
          <DashboardCard subtitle="Active listings" title="Products" value={stats.totalProducts} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Revenue Trend</h3>
          {chartLoading ? (
            <div className="h-64 animate-pulse rounded bg-gray-200" />
          ) : (
            <ResponsiveContainer height={300} width="100%">
              <LineChart data={chart?.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                <Line dataKey="revenue" stroke="#3B82F6" strokeWidth={2} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Orders Overview</h3>
          {chartLoading ? (
            <div className="h-64 animate-pulse rounded bg-gray-200" />
          ) : (
            <ResponsiveContainer height={300} width="100%">
              <BarChart data={chart?.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completedOrders" fill="#10B981" name="Completed" />
                <Bar dataKey="cancelledOrders" fill="#EF4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard subtitle="Per completed order" title="Average Order Value" value={formatCurrency(stats.avgOrderValue)} />
          <DashboardCard
            subtitle={`${stats.completedOrders} of ${stats.totalOrders} orders`}
            title="Completion Rate"
            value={`${stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%`}
          />
          <DashboardCard subtitle="10% platform fee" title="Commission Fee" value={formatCurrency(stats.totalRevenue * 0.1)} />
        </div>
      )}
    </div>
  );
});
