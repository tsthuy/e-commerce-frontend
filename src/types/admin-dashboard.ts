export interface AdminDashboardStats {
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
}

export interface AdminChartDataPoint {
  date: string; // ISO date string
  label: string;
  orderCount: number;
  completedOrders: number;
  cancelledOrders: number;
  revenue: number;
  avgOrderValue: number;
}

export interface AdminDashboardChart {
  period: string;
  type: string;
  data: AdminChartDataPoint[];
}

export type AdminPeriodType = 'today' | '3days' | '7days' | '1month' | '1quarter' | '6months' | '1year' | 'all';
export type AdminChartType = 'daily' | 'weekly' | '2weekly' | 'monthly' | 'yearly';
