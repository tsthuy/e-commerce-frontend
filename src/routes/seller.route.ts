import { PREFIX_SELLER_ROUTE } from '~/constants';

import type { RouteType, SellerRouteKeys } from '~/types';

import { AllEvents, AllProducts, Categories, CreateEvent, CreateProduct, Dashboard, DiscountCodes, EditProduct, ProductView, Refunds, SellerSettings, ShopInbox, WithdrawMoney } from '~/pages/seller';
import { AllNewOrders } from '~/pages/seller/all-orders-new';

export const SELLER_ROUTES: {
  [key in SellerRouteKeys]: RouteType;
} = {
  dashboard: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/dashboard`,
    permission: null,
    Element: Dashboard
  },
  allOrders: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/all-orders`,
    permission: null,
    Element: AllNewOrders
  },
  allProducts: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/all-products`,
    permission: null,
    Element: AllProducts
  },
  createProduct: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/create-product`,
    permission: null,
    Element: CreateProduct
  },
  editProduct: {
    path: (id?: string): string => `${PREFIX_SELLER_ROUTE}/edit-product/${id || ':id'}`,
    permission: null,
    Element: EditProduct
  },
  productView: {
    path: (id?: string): string => `${PREFIX_SELLER_ROUTE}/product/${id || ':id'}`,
    permission: null,
    Element: ProductView
  },
  allEvents: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/all-events`,
    permission: null,
    Element: AllEvents
  },
  createEvent: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/create-event`,
    permission: null,
    Element: CreateEvent
  },
  withdrawMoney: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/withdraw-money`,
    permission: null,
    Element: WithdrawMoney
  },
  shopInbox: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/shop-inbox`,
    permission: null,
    Element: ShopInbox
  },
  discountCodes: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/discount-codes`,
    permission: null,
    Element: DiscountCodes
  },
  refunds: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/refunds`,
    permission: null,
    Element: Refunds
  },
  categories: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/categories`,
    permission: null,
    Element: Categories
  },
  settings: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/settings`,
    permission: null,
    Element: SellerSettings
  }
};
