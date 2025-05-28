import type { AxiosPromise } from 'axios';
import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'sonner';

import { API_URLS, COOKIE_KEYS } from '~/constants';

import type {
  ApiParams,
  ChangePasswordBody,
  LoginWithEmailBody,
  LoginWithEmailResponse,
  LoginWithSocialBody,
  LoginWithSocialResponse,
  LogoutBody,
  LogoutRequest,
  RefreshTokenBody,
  SignUpBody
} from '~/types';

import { httpBase } from '~/services';

import { getErrorMessage } from '~/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  async logout({ data, config }: ApiParams<LogoutBody>): Promise<void> {
    try {
      const token = Cookie.get(COOKIE_KEYS.accessToken);
      const refreshToken = Cookie.get(COOKIE_KEYS.refreshToken);

      if (token && refreshToken) {
        await axios.post<LogoutRequest, void>(`${API_BASE_URL}${API_URLS.auth.logout}`, { token, refreshToken }, config);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      Cookie.remove(COOKIE_KEYS.accessToken);
      Cookie.remove(COOKIE_KEYS.refreshToken);

      if (data?.directUri) {
        window.location.href = data.directUri;
      }
    }
  },
  refreshToken({ data, config }: ApiParams<RefreshTokenBody>): AxiosPromise<LoginWithEmailResponse> {
    return axios.post<LoginWithEmailResponse>(`${API_BASE_URL}${API_URLS.auth.refreshToken}`, data, config);
  },
  changePassword({ data, config }: ApiParams<ChangePasswordBody>): AxiosPromise<void> {
    return httpBase.post<ChangePasswordBody, void>(API_URLS.auth.changePassword, data, config);
  }
};
