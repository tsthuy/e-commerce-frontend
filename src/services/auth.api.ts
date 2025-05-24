import type { AxiosPromise } from 'axios';
import Cookie from 'js-cookie';

import { API_URLS, COOKIE_KEYS } from '~/constants';

import type { ApiParams, LoginWithEmailBody, LoginWithEmailResponse, LoginWithSocialBody, LoginWithSocialResponse, LogoutBody, RefreshTokenBody, RefreshTokenResponse, SignUpBody } from '~/types';

import { httpBase } from '~/services';

export const authApi = {
  signup({ data, config }: ApiParams<SignUpBody>): AxiosPromise<LoginWithEmailResponse> {
    return httpBase.post<SignUpBody, LoginWithEmailResponse>(API_URLS.auth.signup, data, config);
  },
  loginWithEmail({ data, config }: ApiParams<LoginWithEmailBody>): AxiosPromise<LoginWithEmailResponse> {
    return httpBase.post<LoginWithEmailBody, LoginWithEmailResponse>(API_URLS.auth.login.email, data, config);
  },
  loginWithSocial({ data, config }: ApiParams<LoginWithSocialBody>): AxiosPromise<LoginWithSocialResponse> {
    return httpBase.post<LoginWithSocialBody, LoginWithSocialResponse>(API_URLS.auth.login.social, data, config);
  },
  logout({ data }: Omit<ApiParams<LogoutBody>, 'config'>): void {
    Cookie.remove(COOKIE_KEYS.accessToken);
    Cookie.remove(COOKIE_KEYS.refreshToken);

    if (data?.directUri) window.location.href = data.directUri;

    return;
  },
  refreshToken({ data, config }: ApiParams<RefreshTokenBody>): AxiosPromise<RefreshTokenResponse> {
    return httpBase.post<RefreshTokenBody, RefreshTokenResponse>(API_URLS.auth.refreshToken, data, config);
  }
};
