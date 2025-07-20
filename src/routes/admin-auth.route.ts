import { AdminDashboard } from '~/pages/admin/admin-dashboard.page';
import { AdminLoginPage } from '~/pages/admin/admin-login.page';

export const ADMIN_AUTH_ROUTES = {
  login: {
    path: () => '/admin/login',
    Element: AdminLoginPage
  },
  dashboard: {
    path: () => '/admin/dashboard',
    Element: AdminDashboard
  },
  allProducts: {
    path: () => '/admin/all-products',
    Element: null // Will implement later
  },
  allOrders: {
    path: () => '/admin/all-orders',
    Element: null // Will implement later
  },
  allUsers: {
    path: () => '/admin/all-users',
    Element: null // Will implement later
  },
  allSellers: {
    path: () => '/admin/all-sellers',
    Element: null // Will implement later
  },
  settings: {
    path: () => '/admin/settings',
    Element: null // Will implement later
  }
} as const;
