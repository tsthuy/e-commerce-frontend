import { PREFIX_AUTH_ROUTE, PREFIX_SELLER_ROUTE } from '~/constants';

import type { AuthRouteKeys, RouteType } from '~/types';

import { ForgotPasswordPage, LoginPage } from '~/pages/auth';
import { SellerLoginPage, SellerSignUpPage } from '~/pages/auth/seller';
import { SignUpPage } from '~/pages/auth/sign-up';

export const AUTH_ROUTES: {
  [key in AuthRouteKeys]: RouteType;
} = {
  login: {
    path: (): string => `${PREFIX_AUTH_ROUTE}/login`,
    permission: null,
    Element: LoginPage
  },
  forgetPassword: {
    path: (): string => `${PREFIX_AUTH_ROUTE}/forget-password`,
    permission: null,
    Element: ForgotPasswordPage
  },
  signup: {
    path: (): string => `${PREFIX_AUTH_ROUTE}/sign-up`,
    permission: null,
    Element: SignUpPage
  },
  sellerSignup: {
    path: (): string => `${PREFIX_AUTH_ROUTE}${PREFIX_SELLER_ROUTE}/sign-up`,
    permission: null,
    Element: SellerSignUpPage
  },
  sellerLogin: {
    path: (): string => `${PREFIX_AUTH_ROUTE}${PREFIX_SELLER_ROUTE}/login`,
    permission: null,
    Element: SellerLoginPage
  }
};
