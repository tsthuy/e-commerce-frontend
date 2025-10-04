import { PREFIX_PROTECTED_ROUTE } from '~/constants';

import type { ProtectedRoueKeys, RouteType } from '~/types';

import { AddressPage } from '~/pages/protected/address.page';
import { ChangePasswordPage } from '~/pages/protected/change-password.page';
import { CheckoutCancelPage } from '~/pages/protected/checkout-cancel.page';
import { CheckoutSuccessPage } from '~/pages/protected/checkout-success.page';
import { CheckoutPage } from '~/pages/protected/checkout.page';
import { ConversationPage } from '~/pages/protected/conversation.page';
import { MessagePage } from '~/pages/protected/message.page';
import { OrdersPage } from '~/pages/protected/orders.page';
import { ProfilePage } from '~/pages/protected/profile.page';
import { RefundsPage } from '~/pages/protected/refunds.page';
import { TracksPage } from '~/pages/protected/tracks.page';

export const PROTECTED_ROUTES: {
  [key in ProtectedRoueKeys]: RouteType;
} = {
  conversation: {
    path: (conversationId?: string): string => `${PREFIX_PROTECTED_ROUTE}/messages/conversation/${conversationId || ':conversationId'}`,
    permission: null,
    Element: ConversationPage
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
    path: (orderIds?: string): string => `${PREFIX_PROTECTED_ROUTE}/checkout/success/${orderIds || ':orderIds'}`,
    permission: null,
    Element: CheckoutSuccessPage
  },
  checkoutCancel: {
    path: (orderId?: string): string => `${PREFIX_PROTECTED_ROUTE}/checkout/cancel/${orderId || ':orderId'}`,
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
  },
  message: {
    path: (): string => `${PREFIX_PROTECTED_ROUTE}/messages`,
    permission: null,
    Element: MessagePage
  }
};
