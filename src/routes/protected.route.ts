import { PREFIX_PROTECTED_ROUTE } from '~/constants';

import type { ProtectedRoueKeys, RouteType } from '~/types';

import { AddressPage, ChangePasswordPage, CheckoutPage, MessagePage, OrdersPage, ProfilePage, RefundsPage, TracksPage } from '~/pages/protected';

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
