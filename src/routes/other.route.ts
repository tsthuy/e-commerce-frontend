import type { OtherRouteKeys, RouteType } from '~/types';

import { NotFoundPage } from '~/pages/other';

export const OTHER_ROUTES: {
  [key in OtherRouteKeys]: RouteType;
} = {
  blank: {
    path: (target?: string): string => `#${target ?? ''}`,
    permission: null
  },
  '404': {
    path: (): string => '/400',
    permission: null,
    Element: NotFoundPage
  }
};
