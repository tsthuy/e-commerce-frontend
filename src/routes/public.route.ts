import { PREFIX_PUBLIC_ROUTE } from '~/constants';

import type { PublicRouteKeys, RouteType } from '~/types';

import { ExplorePage, HomePage } from '~/pages/public';

export const PUBLIC_ROUTES: {
  [key in PublicRouteKeys]: RouteType;
} = {
  index: {
    path: (): string => `${PREFIX_PUBLIC_ROUTE}`,
    permission: null,
    Element: HomePage
  },
  explore: {
    path: (): string => `${PREFIX_PUBLIC_ROUTE}explore`,
    permission: null,
    Element: ExplorePage
  }
};
