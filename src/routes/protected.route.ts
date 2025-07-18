import { PREFIX_PROTECTED_ROUTE } from '~/constants';

import type { ProtectedRoueKeys, RouteType } from '~/types';

import { AddressPage, ChangePasswordPage, CheckoutPage, MessagePage, OrdersPage, ProfilePage, RefundsPage, TracksPage } from '~/pages/protected';
import { CheckoutCancelPage } from '~/pages/protected/checkout-cancel.page';
import { CheckoutSuccessPage } from '~/pages/protected/checkout-success.page';

export const PROTECTED_ROUTES: {
  [key in ProtectedRoueKeys]: RouteType;
} = {
  message: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/message`,
    permission: null,
    Element: MessagePage
  },
  profile: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/profile`,
    permission: null,
    Element: ProfilePage
  },
  orders: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/orders`,
    permission: null,
    Element: OrdersPage
  },
  checkout: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/checkout`,
    permission: null,
    Element: CheckoutPage
  },
  checkoutSuccess: {
    path: (orderId?: string): string => `${PREFIX_PROTECTED_ROUTE}/checkout/success/${orderId || ':orderId'}`,
    permission: null,
    Element: CheckoutSuccessPage
  },
  checkoutCancel: {
    path: () => '/user/checkout/cancel',
    permission: null,
    Element: CheckoutCancelPage
  },
  refunds: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/refunds`,
    permission: null,
    Element: RefundsPage
  },
  tracks: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/tracks`,
    permission: null,
    Element: TracksPage
  },
  changePassword: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/change-password`,
    permission: null,
    Element: ChangePasswordPage
  },
  address: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/address`,
    permission: null,
    Element: AddressPage
  }
};
