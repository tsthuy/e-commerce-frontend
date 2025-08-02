import { memo, useMemo, useState } from 'react';

import { BarChart3Icon, DollarSignIcon, PackageIcon, ShoppingCartIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { SEO_AUTHOR } from '~/constants';

import { AdminPeriodSelector } from '~/components/admin/admin-period-selector';
import { Helmet } from '~/components/common';
import { DashboardCard } from '~/components/dashboard/dashboard-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui';

import { useAdminDashboardChart, useAdminDashboardStats } from '~/hooks/use-admin-dashboard.hook';
import type { AdminChartType, AdminPeriodType } from '~/types/admin-dashboard';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const AdminDashboard = memo(() => {
  const [selectedPeriod, setSelectedPeriod] = useState<AdminPeriodType>('3days');

  // Determine chart type based on selected period
  const getChartType = (period: AdminPeriodType): AdminChartType => {
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

  const { data: dashboardStats, isLoading: statsLoading } = useAdminDashboardStats({
    data: { period: selectedPeriod }
  });

  const { data: chartData, isLoading: chartLoading } = useAdminDashboardChart({
    data: { period: selectedPeriod, type: getChartType(selectedPeriod) }
  });

  const statsCards = useMemo(
    () => [
      {
        title: 'Total Users',
        value: dashboardStats?.totalUsers || 0,
        icon: <UsersIcon className="h-4 w-4" color="blue" />,
        subtitle: `${dashboardStats?.totalCustomers || 0} customers, ${dashboardStats?.totalSellers || 0} sellers`
      },
      {
        title: 'Total Products',
        value: dashboardStats?.totalProducts || 0,
        icon: <PackageIcon className="h-4 w-4" color="orange" />,
        subtitle: `${dashboardStats?.activeProducts || 0} active products`
      },
      {
        title: 'Total Orders',
        value: dashboardStats?.totalOrders || 0,
        icon: <ShoppingCartIcon className="h-4 w-4" color="green" />,
        subtitle: `${dashboardStats?.completedOrders || 0} completed, ${dashboardStats?.cancelledOrders || 0} cancelled`
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(dashboardStats?.totalRevenue || 0),
        icon: <DollarSignIcon className="h-4 w-4" color="purple" />,
        subtitle: `Avg order: ${formatCurrency(dashboardStats?.avgOrderValue || 0)}`
      },
      {
        title: 'Commission Earned',
        value: formatCurrency(dashboardStats?.totalCommissionEarned || 0),
        icon: <TrendingUpIcon className="h-4 w-4" color="teal" />,
        subtitle: `Success rate: ${dashboardStats?.orderSuccessRate?.toFixed(1) || 0}%`
      },
      {
        title: 'Active Sellers',
        value: dashboardStats?.activeSellers || 0,
        icon: <BarChart3Icon className="h-4 w-4" color="indigo" />,
        subtitle: 'Currently active'
      }
    ],
    [dashboardStats]
  );

  if (statsLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="h-10 w-[140px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Helmet title={`Admin Dashboard - ${SEO_AUTHOR}`}>
      <div className="space-y-6 p-6">
        {/* Header with Period Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">System overview and statistics</p>
          </div>
          <AdminPeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((card) => (
            <DashboardCard key={card.title} icon={card.icon} subtitle={card.subtitle} title={card.title} value={card.value} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">System Revenue Trend</CardTitle>
              <CardDescription>Total platform revenue over time</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {chartLoading ? (
                <div className="h-64 animate-pulse rounded bg-gray-200" />
              ) : (
                <ResponsiveContainer height={300} width="100%">
                  <LineChart data={chartData?.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                    <Line dataKey="revenue" stroke="#3B82F6" strokeWidth={2} type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Orders Overview</CardTitle>
              <CardDescription>System-wide order completion rates</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {chartLoading ? (
                <div className="h-64 animate-pulse rounded bg-gray-200" />
              ) : (
                <ResponsiveContainer height={300} width="100%">
                  <BarChart data={chartData?.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completedOrders" fill="#10B981" name="Completed" />
                    <Bar dataKey="cancelledOrders" fill="#EF4444" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional System Metrics */}
        {dashboardStats && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              subtitle={`${dashboardStats.completedOrders} of ${dashboardStats.totalOrders} orders completed`}
              title="Platform Success Rate"
              value={`${dashboardStats.orderSuccessRate?.toFixed(1) || 0}%`}
            />
            <DashboardCard subtitle="Across all completed orders" title="Average Order Value" value={formatCurrency(dashboardStats.avgOrderValue)} />
            <DashboardCard
              subtitle={`${((dashboardStats.totalCommissionEarned / dashboardStats.totalRevenue) * 100).toFixed(1)}% of total revenue`}
              title="Platform Commission"
              value={formatCurrency(dashboardStats.totalCommissionEarned)}
            />
          </div>
        )}
      </div>
    </Helmet>
  );
});
