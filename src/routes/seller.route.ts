import { PREFIX_SELLER_ROUTE } from '~/constants';

import type { RouteType, SellerRouteKeys } from '~/types';

import { ConversationPage } from '~/pages/protected/conversation.page';
import { AllEvents, AllProducts, Categories, CreateEvent, CreateProduct, DiscountCodes, EditProduct, ProductView, Refunds, SellerSettings, WithdrawMoney } from '~/pages/seller';
import { AllNewOrders } from '~/pages/seller/all-orders-new';
import { SellerDashboard } from '~/pages/seller/seller-dashboard';
import { ShopInboxPage } from '~/pages/seller/shop-inbox.page';

export const SELLER_ROUTES: {
  [key in SellerRouteKeys]: RouteType;
} = {
  dashboard: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/dashboard`,
    permission: null,
    Element: SellerDashboard
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
    Element: ShopInboxPage
  },
  conversation: {
    path: (conversationId?: string): string => `${PREFIX_SELLER_ROUTE}/inbox/conversation/${conversationId || ':conversationId'}`,
    permission: null,
    Element: ConversationPage
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
