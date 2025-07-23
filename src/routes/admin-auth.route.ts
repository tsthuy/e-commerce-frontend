import { PREFIX_ADMIN_ROUTE } from '~/constants';

import { AdminAllOrdersPage } from '~/pages/admin/admin-all-orders.page';
import { AdminAllProductsPage } from '~/pages/admin/admin-all-products.page';
import { AdminDashboard } from '~/pages/admin/admin-dashboard.page';
import { AdminLoginPage } from '~/pages/admin/admin-login.page';
import { AdminCustomersPage } from '~/pages/admin/components/admin-customers-page';
import { AdminSellersPage } from '~/pages/admin/components/admin-sellers-page';
import { Categories, ProductView } from '~/pages/seller';

export const ADMIN_AUTH_ROUTES = {
  login: {
    path: () => '/admin/login',
    Element: AdminLoginPage
  },
  dashboard: {
    path: () => '/admin/dashboard',
    Element: AdminDashboard
  },
  categories: {
    path: () => '/admin/categories',
    Element: Categories
  },
  allProducts: {
    path: () => '/admin/all-products',
    Element: AdminAllProductsPage
  },
  productView: {
    path: (id?: string): string => `${PREFIX_ADMIN_ROUTE}/product-view/${id || ':id'}`,
    permission: null,
    Element: ProductView
  },

  allOrders: {
    path: () => '/admin/all-orders',
    Element: AdminAllOrdersPage
  },

  allCustomers: {
    path: () => '/admin/all-customers',
    Element: AdminCustomersPage
  },
  allSellers: {
    path: () => '/admin/all-sellers',
    Element: AdminSellersPage
  },
  settings: {
    path: () => '/admin/settings',
    Element: null // Will implement later
  }
} as const;
