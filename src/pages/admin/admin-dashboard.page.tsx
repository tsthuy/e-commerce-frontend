import { memo, useMemo } from 'react';

import { BarChart3Icon, DollarSignIcon, PackageIcon, ShoppingCartIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';

import { SEO_AUTHOR } from '~/constants';

import { Helmet } from '~/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui';

import { useAdminDashboardStats } from '~/hooks/use-admin-dashboard.hook';

export const AdminDashboard = memo(() => {
  const { data: dashboardStats, isLoading } = useAdminDashboardStats({
    data: { period: '30d' }
  });

  const statsCards = useMemo(
    () => [
      {
        title: 'Total Users',
        value: dashboardStats?.totalUsers || 0,
        icon: UsersIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: `${dashboardStats?.totalCustomers || 0} customers, ${dashboardStats?.totalSellers || 0} sellers`
      },
      {
        title: 'Total Products',
        value: dashboardStats?.totalProducts || 0,
        icon: PackageIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        description: `${dashboardStats?.activeProducts || 0} active products`
      },
      {
        title: 'Total Orders',
        value: dashboardStats?.totalOrders || 0,
        icon: ShoppingCartIcon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        description: `${dashboardStats?.completedOrders || 0} completed, ${dashboardStats?.cancelledOrders || 0} cancelled`
      },
      {
        title: 'Total Revenue',
        value: `$${dashboardStats?.totalRevenue?.toLocaleString() || 0}`,
        icon: DollarSignIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        description: `Avg order: $${dashboardStats?.avgOrderValue?.toFixed(2) || 0}`
      },
      {
        title: 'Commission Earned',
        value: `$${dashboardStats?.totalCommissionEarned?.toLocaleString() || 0}`,
        icon: TrendingUpIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        description: `Success rate: ${dashboardStats?.orderSuccessRate?.toFixed(1) || 0}%`
      },
      {
        title: 'Active Sellers',
        value: dashboardStats?.activeSellers || 0,
        icon: BarChart3Icon,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        description: 'Currently active'
      }
    ],
    [dashboardStats]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Helmet title={`Admin Dashboard - ${SEO_AUTHOR}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">System overview and statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                  <div className={`rounded-lg p-2 ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-1 text-2xl font-bold text-gray-900">{card.value}</div>
                  <CardDescription className="text-xs">{card.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Order Success Rate</span>
                  <span className="font-semibold">{dashboardStats?.orderSuccessRate?.toFixed(1) || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Products</span>
                  <span className="font-semibold">{dashboardStats?.activeProducts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Sellers</span>
                  <span className="font-semibold">{dashboardStats?.activeSellers || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="font-semibold">${dashboardStats?.totalRevenue?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Commission Earned</span>
                  <span className="font-semibold">${dashboardStats?.totalCommissionEarned?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Order Value</span>
                  <span className="font-semibold">${dashboardStats?.avgOrderValue?.toFixed(2) || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Helmet>
  );
});
