import type { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import Cookie from 'js-cookie';

import { API_HAVE_SLASH_IN_END, COOKIE_KEYS, COOKIE_OPTIONS } from '~/constants';

import { AUTH_ROUTES } from '~/routes';

import { authApi } from './auth.api';

class Http {
  public instance: AxiosInstance;
  private slashInEnd: boolean;

  public constructor(url: string, slashInEnd?: boolean) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        // 'ngrok-skip-browser-warning': 'true'
      }
    });
    this.slashInEnd = slashInEnd ?? API_HAVE_SLASH_IN_END;
  }

  private convertEndPoint(url: string): string {
    return this.slashInEnd ? (url.includes('?') && !url.includes('/?') ? url.replace('?', '/?') : `${url}/`) : url;
  }

  public get<TResponse>(url: string, config?: AxiosRequestConfig): AxiosPromise<TResponse> {
    return this.instance.get(this.convertEndPoint(url), config);
  }

  public post<TBody, TResponse>(url: string, data?: TBody, config?: AxiosRequestConfig): AxiosPromise<TResponse> {
    return this.instance.post(this.convertEndPoint(url), data, config);
  }

  public patch<TBody, TResponse>(url: string, data?: TBody, config?: AxiosRequestConfig): AxiosPromise<TResponse> {
    return this.instance.patch(this.convertEndPoint(url), data, config);
  }

  public put<TBody, TResponse>(url: string, data?: TBody, config?: AxiosRequestConfig): AxiosPromise<TResponse> {
    return this.instance.put(this.convertEndPoint(url), data, config);
  }

  public delete<TResponse>(url: string, config?: AxiosRequestConfig): AxiosPromise<TResponse> {
    return this.instance.delete(this.convertEndPoint(url), config);
  }
}

const limitRefetchToken = 1;
let refreshTokenHttpBase = 0;

const httpBase = new Http(import.meta.env.VITE_API_BASE_URL);
httpBase.instance.interceptors.request.use(
  (config) => {
    const accessToken = Cookie.get(COOKIE_KEYS.accessToken);

    if (!!!config.headers.Authorization && accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);
httpBase.instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalConfig = error.config;

    if (error.response && error.response.status === 401) {
      const refresh = Cookie.get(COOKIE_KEYS.refreshToken);

      if (!!!refresh || refreshTokenHttpBase >= limitRefetchToken) {
        await authApi.logout({ data: { directUri: AUTH_ROUTES.login.path() } });

        return Promise.reject(error);
      } else {
        refreshTokenHttpBase++;
      }

      try {
        const { data } = await authApi.refreshToken({ data: { refreshToken: refresh } });
        const { accessToken, refreshToken } = data;

        if (accessToken && refreshToken) {
          refreshTokenHttpBase = 0;

          Cookie.set(COOKIE_KEYS.accessToken, accessToken, COOKIE_OPTIONS);
          Cookie.set(COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);

          originalConfig.headers.Authorization = `Bearer ${accessToken}`;

          return axios(originalConfig);
        } else {
          await authApi.logout({ data: { directUri: AUTH_ROUTES.login.path() } });

          return Promise.reject(error);
        }
      } catch {
        await authApi.logout({ data: { directUri: AUTH_ROUTES.login.path() } });

        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { httpBase };
