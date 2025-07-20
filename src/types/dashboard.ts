export interface DashboardStats {
  availableAmount: number;
  totalOrders: number;
  totalProducts: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  period: string;
}

export interface ChartDataPoint {
  date: string; // ISO date string
  label: string;
  orderCount: number;
  completedOrders: number;
  cancelledOrders: number;
  revenue: number;
  avgOrderValue: number;
}

export interface DashboardChart {
  period: string;
  type: string;
  data: ChartDataPoint[];
}

export type PeriodType = 'today' | '3days' | '7days' | '1month' | '1quarter' | '6months' | '1year' | 'all';
export type ChartType = 'daily' | 'weekly' | '2weekly' | 'monthly' | 'yearly';
