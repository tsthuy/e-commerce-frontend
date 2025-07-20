import type { StringOrNull } from './common';

export type AdminProfileResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  department: StringOrNull;
  adminLevel: number;
  superAdmin: boolean;
};

export type AdminLoginRequest = {
  username: string;
  password: string;
};

export type AdminDashboardStatsResponse = {
  totalUsers: number;
  totalCustomers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalCommissionEarned: number;
  avgOrderValue: number;
  orderSuccessRate: number;
  activeProducts: number;
  activeSellers: number;
};

export type AdminDashboardChartRequest = {
  period: string;
  type: string;
};

export type AdminDashboardStatsRequest = {
  period: string;
};
