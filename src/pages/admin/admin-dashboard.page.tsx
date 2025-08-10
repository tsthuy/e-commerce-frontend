import { memo, useMemo, useState } from 'react';

import { BarChart3Icon, DollarSignIcon, PackageIcon, ShoppingCartIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { SEO_AUTHOR } from '~/constants';

import { useTranslation } from '~/hooks';

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
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<AdminPeriodType>('3days');

  const getChartType = (period: AdminPeriodType): AdminChartType => {
    switch (period) {
      case 'today':
      case '3days':
      case '7days':
        return 'daily';
      case '1month':
        return 'weekly';
      case '1quarter':
        return '2weekly';
      case '6months':
        return 'monthly';
      case '1year':
        return 'monthly';
      case 'all':
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
        title: t('Admin.dashboard.totalUsers'),
        value: dashboardStats?.totalUsers || 0,
        icon: <UsersIcon className="h-4 w-4" color="blue" />,
        subtitle: `${dashboardStats?.totalCustomers || 0} ${t('Admin.dashboard.customers')}, ${dashboardStats?.totalSellers || 0} ${t('Admin.dashboard.sellers')}`
      },
      {
        title: t('Admin.dashboard.totalProducts'),
        value: dashboardStats?.totalProducts || 0,
        icon: <PackageIcon className="h-4 w-4" color="orange" />,
        subtitle: `${dashboardStats?.activeProducts || 0} ${t('Admin.dashboard.activeProducts')}`
      },
      {
        title: t('Admin.dashboard.totalOrders'),
        value: dashboardStats?.totalOrders || 0,
        icon: <ShoppingCartIcon className="h-4 w-4" color="green" />,
        subtitle: `${dashboardStats?.completedOrders || 0} ${t('Admin.dashboard.completed')}, ${dashboardStats?.cancelledOrders || 0} ${t('Admin.dashboard.cancelled')}`
      },
      {
        title: t('Admin.dashboard.totalRevenue'),
        value: formatCurrency(dashboardStats?.totalRevenue || 0),
        icon: <DollarSignIcon className="h-4 w-4" color="purple" />,
        subtitle: `${t('Admin.dashboard.avgOrder')}: ${formatCurrency(dashboardStats?.avgOrderValue || 0)}`
      },
      {
        title: t('Admin.dashboard.commissionEarned'),
        value: formatCurrency(dashboardStats?.totalCommissionEarned || 0),
        icon: <TrendingUpIcon className="h-4 w-4" color="teal" />,
        subtitle: `${t('Admin.dashboard.successRate')}: ${dashboardStats?.orderSuccessRate?.toFixed(1) || 0}%`
      },
      {
        title: t('Admin.dashboard.activeSellers'),
        value: dashboardStats?.activeSellers || 0,
        icon: <BarChart3Icon className="h-4 w-4" color="indigo" />,
        subtitle: t('Admin.dashboard.currentlyActive')
      }
    ],
    [dashboardStats, t]
  );

  if (statsLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('Admin.dashboard.title')}</h1>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('Admin.dashboard.title')}</h1>
            <p className="mt-1 text-sm text-gray-600">{t('Admin.dashboard.subtitle')}</p>
          </div>
          <AdminPeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((card) => (
            <DashboardCard key={card.title} icon={card.icon} subtitle={card.subtitle} title={card.title} value={card.value} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">{t('Admin.dashboard.systemRevenueTrend')}</CardTitle>
              <CardDescription>{t('Admin.dashboard.totalPlatformRevenue')}</CardDescription>
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
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), t('Admin.dashboard.revenue')]} />
                    <Line dataKey="revenue" stroke="#3B82F6" strokeWidth={2} type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">{t('Admin.dashboard.ordersOverview')}</CardTitle>
              <CardDescription>{t('Admin.dashboard.systemWideOrderCompletion')}</CardDescription>
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
                    <Bar dataKey="completedOrders" fill="#10B981" name={t('Admin.dashboard.completedOrders')} />
                    <Bar dataKey="cancelledOrders" fill="#EF4444" name={t('Admin.dashboard.cancelledOrders')} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {dashboardStats && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              subtitle={`${dashboardStats.completedOrders} ${t('Admin.dashboard.of')} ${dashboardStats.totalOrders} ${t('Admin.dashboard.ordersCompleted')}`}
              title={t('Admin.dashboard.platformSuccessRate')}
              value={`${dashboardStats.orderSuccessRate?.toFixed(1) || 0}%`}
            />
            <DashboardCard subtitle={t('Admin.dashboard.acrossAllCompletedOrders')} title={t('Admin.dashboard.averageOrderValue')} value={formatCurrency(dashboardStats.avgOrderValue)} />
            <DashboardCard
              subtitle={`${((dashboardStats.totalCommissionEarned / dashboardStats.totalRevenue) * 100).toFixed(1)}% ${t('Admin.dashboard.ofTotalRevenue')}`}
              title={t('Admin.dashboard.platformCommission')}
              value={formatCurrency(dashboardStats.totalCommissionEarned)}
            />
          </div>
        )}
      </div>
    </Helmet>
  );
});
