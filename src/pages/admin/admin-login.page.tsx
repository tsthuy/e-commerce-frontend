import { memo, useMemo, useState } from 'react';

import Cookie from 'js-cookie';
import { KeyRoundIcon, UserIcon } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { COOKIE_KEYS, COOKIE_OPTIONS, LOGO, SEO_AUTHOR } from '~/constants';

import type { DataForm } from '~/types';

import { adminApi } from '~/services';

import { useTranslation } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { AuthLayoutContent } from '~/layouts';

import { Button, Helmet } from '~/components/common';
import { CustomForm, CustomInput, CustomInputPassword } from '~/components/form';

export const AdminLoginPage = memo(() => {
  const { push } = useHistory();
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        username: z.string().min(1, {
          message: validates.required.message(t('Common.username'))
        }),
        password: z
          .string()
          .min(1, { message: validates.required.message(t('Common.password')) })
          .refine((value) => validates.password.length.pattern.test(value), validates.password.length.message)
      }),
    [t]
  );

  const defaultValues = useMemo(
    () => ({
      username: 'admin12345',
      password: '12345678'
    }),
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const { username, password } = values;

      try {
        const response = await adminApi.loginAdmin({ data: { username, password } });
        const { accessToken, refreshToken } = response.data;

        if (!!accessToken && !!refreshToken) {
          Cookie.set(COOKIE_KEYS.accessToken, accessToken, COOKIE_OPTIONS);
          Cookie.set(COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);

          push('/admin/dashboard');
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
    <Helmet title={`Admin Login - ${SEO_AUTHOR}`}>
      <AuthLayoutContent>
        <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <img alt={SEO_AUTHOR} className="mx-auto h-[90px] w-auto" src={LOGO} />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
              <p className="mt-2 text-sm text-gray-600">Sign in to admin dashboard</p>
            </div>
            <div>
              <CustomInput isRequired disabled={isLoading} label={t('Common.username')} name="username" placeholder="admin12345" startIcon={UserIcon} type="text" />
              <CustomInputPassword isRequired disabled={isLoading} label={t('Common.password')} name="password" placeholder="********" startIcon={KeyRoundIcon} />
            </div>
            <Button className="w-full" color="black" disabled={isLoading} isLoading={isLoading} type="submit">
              Sign In as Admin
            </Button>
          </div>
        </CustomForm>
      </AuthLayoutContent>
    </Helmet>
  );
});
