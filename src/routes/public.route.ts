import { PREFIX_PUBLIC_ROUTE } from '~/constants';

import type { PublicRouteKeys, RouteType } from '~/types';

import { BestSellingPage, ExplorePage, HomePage, ProductsPage } from '~/pages/public';
import { EventsPage } from '~/pages/public/events';
import { FAQPage } from '~/pages/public/faq';

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
  },
  bestSelling: {
    path: (): string => `${PREFIX_PUBLIC_ROUTE}best-selling`,
    permission: null,
    Element: BestSellingPage
  },
  products: {
    path: (): string => `${PREFIX_PUBLIC_ROUTE}products`,
    permission: null,
    Element: ProductsPage
  },
  events: {
    path: (): string => `${PREFIX_PUBLIC_ROUTE}events`,
    permission: null,
    Element: EventsPage
  },
  faq: {
    path: (): string => `${PREFIX_PUBLIC_ROUTE}faq`,
    permission: null,
    Element: FAQPage
  }
};
