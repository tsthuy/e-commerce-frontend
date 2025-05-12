import { memo, useEffect, useMemo, useState } from 'react';

import type { GoogleLoginResponse } from '@leecheuk/react-google-login';
import { GoogleLogin } from '@leecheuk/react-google-login';
import { gapi } from 'gapi-script';
import Cookie from 'js-cookie';
import { KeyRoundIcon, MailIcon } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { COOKIE_KEYS, COOKIE_OPTIONS, LOGO, SEO_AUTHOR } from '~/constants';

import type { AnyType, DataForm } from '~/types';

import { authApi } from '~/services';

import { getErrorMessage, validates } from '~/utils';

import { AuthLayoutContent } from '~/layouts';

import { Button, Helmet } from '~/components/common';
import { CustomForm, CustomInput, CustomInputPassword } from '~/components/form';

import { AUTH_ROUTES, PUBLIC_ROUTES } from '~/routes';

export const LoginPage = memo(() => {
  const { push } = useHistory();

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, {
            message: validates.required.message('Email')
          })
          .refine((value) => validates.email.pattern.test(value), validates.email.message),
        password: z
          .string()
          .min(1, { message: validates.required.message('Password') })
          .refine((value) => validates.password.length.pattern.test(value), validates.password.length.message)
      }),
    []
  );
  const defaultValues = useMemo(
    () => ({
      email: 'doughdevx@gmail.com',
      password: '12345678'
    }),
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const start = (): void => {
      gapi.client.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: ''
      });
    };

    gapi.load('client:auth2', start);
  });

  const handleLogin = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const { email, password } = values;

      const {
        data: { id }
      } = await authApi.getStarted({ data: { email } });

      if (!!id) {
        try {
          const {
            data: { token, refresh }
          } = await authApi.loginWithEmail({ data: { id, password } });

          if (!!token && !!refresh) {
            Cookie.set(COOKIE_KEYS.accessToken, token, COOKIE_OPTIONS);
            Cookie.set(COOKIE_KEYS.refreshToken, refresh, COOKIE_OPTIONS);

            push(PUBLIC_ROUTES.index.path());
          } else {
            throw new Error();
          }
        } catch (error) {
          throw error;
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Email address or password is incorrect! Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response: AnyType): Promise<void> => {
    try {
      if (!!(response as GoogleLoginResponse)?.tokenId) {
        const {
          data: { token, refresh }
        } = await authApi.loginWithSocial({ data: { access_token: (response as GoogleLoginResponse).tokenId, provider: 'Google' } });

        if (!!token && !!refresh) {
          Cookie.set(COOKIE_KEYS.accessToken, token, COOKIE_OPTIONS);
          Cookie.set(COOKIE_KEYS.refreshToken, refresh, COOKIE_OPTIONS);

          push(PUBLIC_ROUTES.index.path());
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error('Something went wrong! Please try again.');
    }
  };
  const handleGoogleLoginFailure = (error: AnyType): void => {
    console.error('handleGoogleLoginFailure: ', error);
    toast.error('Something went wrong! Please try again.');
  };

  return (
    <Helmet title={`Sign in to ${SEO_AUTHOR}`}>
      <AuthLayoutContent>
        <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <img alt={SEO_AUTHOR} className="mx-auto h-[90px] w-auto" src={LOGO} />
            <div>
              <CustomInput isRequired disabled={isLoading} label="Email" name="email" placeholder="example@gmail.com" startIcon={MailIcon} type="email" />
              <div className="relative">
                <CustomInputPassword isRequired disabled={isLoading} label="Password" name="password" placeholder="********" startIcon={KeyRoundIcon} />
                <Link className="absolute right-0 top-0 text-xs leading-7 text-muted-foreground transition-colors hover:text-primary" to={AUTH_ROUTES.forgetPassword.path()}>
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button className="w-full" color="black" disabled={isLoading} isLoading={isLoading} type="submit">
              Sign in
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
            <GoogleLogin
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              render={(props) => (
                <Button className="w-full" variant="outline" {...props} disabled={isLoading}>
                  <svg className="mr-2 size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              )}
              onFailure={handleGoogleLoginFailure}
              onSuccess={handleGoogleLoginSuccess}
            />

            <div className="text-center text-sm">
              New to {SEO_AUTHOR}?{' '}
              <Link className="inline-flex" to={AUTH_ROUTES.signup.path()}>
                <Button animation={{ type: 'line', placement: 'hide' }} className="h-fit p-0 after:!bottom-[-0.5px] after:!w-full" type="button" variant="link">
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </CustomForm>
      </AuthLayoutContent>
    </Helmet>
  );
});
