import { memo, useMemo, useState } from 'react';

import { toast } from 'sonner';
import { z } from 'zod';

import type { DataForm } from '~/types';

import { authApi } from '~/services';

import { useCustomForm, useTranslation } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { Button } from '~/components/common';
import { CustomForm, CustomInputPassword } from '~/components/form';

export const ChangePassword = memo(() => {
  const { t } = useTranslation();

  const schema = z
    .object({
      password: z.string().min(1, { message: validates.required.message(t('Common.currentPassword')) }),
      newPassword: z.string().min(8, { message: t('Common.passwordMustBeAtLeast8') }),

      confirmPassword: z.string().min(1, { message: validates.required.message(t('Common.confirmPassword')) })
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: validates.password.match,
      path: ['confirmPassword']
    })
    .refine((data) => data.password !== data.newPassword, {
      message: t('Common.newPasswordMustBeDifferent'),
      path: ['newPassword']
    });
  const defaultValues = useMemo(
    () => ({
      password: '',
      newPassword: '',
      confirmPassword: ''
    }),
    []
  );

  const { form } = useCustomForm(schema, { defaultValues });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangePassword = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;
    try {
      setIsLoading(false);
      const { password, newPassword } = values;
      const response = await authApi.changePassword({ data: { password, newPassword } });

      if (response.status == 200) toast.success(t('Common.passwordUpdatedSuccessfully'));
      form.reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full p-6">
      <h2 className="text-center text-xl font-bold">{t('Common.changePassword')}</h2>
      <CustomForm className="flex flex-col gap-4" provider={form} onSubmit={handleChangePassword}>
        <CustomInputPassword disabled={isLoading} label={t('Common.enterOldPassword')} name="password" placeholder="********" />
        <CustomInputPassword disabled={isLoading} label={t('Common.enterNewPassword')} name="newPassword" placeholder="********" />
        <CustomInputPassword disabled={isLoading} label={t('Common.enterConfirmPassword')} name="confirmPassword" placeholder="********" />

        <Button className="items-end" disabled={isLoading} isLoading={isLoading} type="submit">
          {t('Common.update')}
        </Button>
      </CustomForm>
    </div>
  );
});
