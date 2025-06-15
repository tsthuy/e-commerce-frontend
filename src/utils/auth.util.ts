// src/utils/auth.util.ts
import Cookie from 'js-cookie';

import { COOKIE_KEYS } from '~/constants';

import type { UserRole } from '~/types';

type JwtPayload = {
  sub: string;
  scope?: string;
  iss: string;
  exp: number;
  token_type: string;
  iat: number;
  jti: string;
};

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const hasRole = (role: UserRole): boolean => {
  const token = Cookie.get(COOKIE_KEYS.accessToken);
  if (!token) return false;

  const payload = parseJwt(token);
  return payload?.scope?.includes(`ROLE_${role}`) || false;
};

export const isAuthenticated = (): boolean => {
  return !!Cookie.get(COOKIE_KEYS.accessToken) && !!Cookie.get(COOKIE_KEYS.refreshToken);
};
