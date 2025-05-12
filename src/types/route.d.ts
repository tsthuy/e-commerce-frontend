import type React from 'react';

import type { PERMISSIONS } from '~/constants';

export type RouteType = {
  path: (params?: string) => string;
  permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | null;
  Element?: React.MemoExoticComponent<() => React.JSX.Element>;
};

export type AdminRouteKeys = 'components' | 'buttons' | 'inputs' | 'selects' | 'checkboxRadioSwitch' | 'dialog' | 'tooltip' | 'dropdownPopover' | 'avatarBadge' | 'tab';

export type AuthRouteKeys = 'login' | 'signup' | 'forgetPassword';

export type ProtectedRoueKeys = 'message' | 'profile';

export type PublicRouteKeys = 'index' | 'explore';

export type OtherRouteKeys = 'blank' | '404';
