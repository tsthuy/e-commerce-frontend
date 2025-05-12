import { PREFIX_PROTECTED_ROUTE } from '~/constants';

import type { ProtectedRoueKeys, RouteType } from '~/types';

import { MessagePage, ProfilePage } from '~/pages/protected';

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
  }
};
