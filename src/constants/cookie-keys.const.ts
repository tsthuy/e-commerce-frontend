const VERSION_KEY = 'V1';
const ROLE = 'ADMIN';

export const COOKIE_KEYS = {
  accessToken: `ACCESS_TOKEN_${ROLE}_${VERSION_KEY}`,
  refreshToken: `REFRESH_TOKEN_${ROLE}_${VERSION_KEY}`
};

export const COOKIE_OPTIONS: {
  httpOnly?: boolean | undefined;
  sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | undefined;
  path?: string | undefined;
} = {
  httpOnly: false,
  sameSite: 'lax',
  path: '/'
};
