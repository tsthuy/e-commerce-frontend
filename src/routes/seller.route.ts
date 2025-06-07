import { PREFIX_SELLER_ROUTE } from '~/constants';

import type { RouteType, SellerRouteKeys } from '~/types';

import { Dashboard } from '~/pages/seller';

export const SELLER_ROUTES: {
  [key in SellerRouteKeys]: RouteType;
} = {
  dashboard: {
    path: (): string => `${PREFIX_SELLER_ROUTE}/dashboard`,
    permission: null,
    Element: Dashboard
  }
};
