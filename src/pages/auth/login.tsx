import { memo, useMemo, useState } from 'react';

import Cookie from 'js-cookie';
import { KeyRoundIcon, MailIcon } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { COOKIE_KEYS, COOKIE_OPTIONS, LOGO, SEO_AUTHOR } from '~/constants';

import type { DataForm } from '~/types';

import { authApi } from '~/services';

import { useTranslation } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { AuthLayoutContent } from '~/layouts';

import { Button, GoogleLoginButton, Helmet } from '~/components/common';
import { CustomForm, CustomInput, CustomInputPassword } from '~/components/form';

import { AUTH_ROUTES, PUBLIC_ROUTES } from '~/routes';

export const LoginPage = memo(() => {
  const { push } = useHistory();
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, {
            message: validates.required.message(t('Common.email'))
          })
          .refine((value) => validates.email.pattern.test(value), validates.email.message),
        password: z
          .string()
          .min(1, { message: validates.required.message(t('Common.password')) })
          .refine((value) => validates.password.length.pattern.test(value), validates.password.length.message)
      }),
    [t]
  );
  const defaultValues = useMemo(
    () => ({
      email: 'doughdevx7@gmail.com',
      password: '12345678'
    }),
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const { email, password } = values;

      try {
        const {
          data: { accessToken, refreshToken }
        } = await authApi.loginWithEmail({ data: { email, password } });

        if (!!accessToken && !!refreshToken) {
          Cookie.set(COOKIE_KEYS.accessToken, accessToken, COOKIE_OPTIONS);
          Cookie.set(COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);

          push(PUBLIC_ROUTES.index.path());
        } else {
          throw new Error();
        }
      } catch (error) {
        throw error;
      }
    } catch (error) {
      toast.error(getErrorMessage(error, t('Auth.loginError')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Helmet title={t('Auth.signInTitle', { author: SEO_AUTHOR })}>
      <AuthLayoutContent>
        <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <img alt={SEO_AUTHOR} className="mx-auto h-[90px] w-auto" src={LOGO} />
            <div>
              <CustomInput isRequired disabled={isLoading} label={t('Common.email')} name="email" placeholder="example@gmail.com" startIcon={MailIcon} type="email" />
              <div className="relative">
                <CustomInputPassword isRequired disabled={isLoading} label={t('Common.password')} name="password" placeholder="********" startIcon={KeyRoundIcon} />
                <Link className="absolute right-0 top-0 text-xs leading-7 text-muted-foreground transition-colors hover:text-primary" to={AUTH_ROUTES.forgetPassword.path()}>
                  {t('Auth.forgotPassword')}
                </Link>
              </div>
            </div>
            <Button className="w-full" color="black" disabled={isLoading} isLoading={isLoading} type="submit">
              {t('Auth.signIn')}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">{t('Auth.orContinueWith')}</span>
            </div>

            <GoogleLoginButton authenticationType="CUSTOMER" disabled={isLoading} />

            <div className="text-center text-sm">
              {t('Auth.newUser', { author: SEO_AUTHOR })}{' '}
              <Link className="inline-flex" to={AUTH_ROUTES.signup.path()}>
                <Button animation={{ type: 'line', placement: 'hide' }} className="h-fit p-0 after:!bottom-[-0.5px] after:!w-full" type="button" variant="link">
                  {t('Auth.createAccount')}
                </Button>
              </Link>
            </div>
          </div>
        </CustomForm>
      </AuthLayoutContent>
    </Helmet>
  );
});
