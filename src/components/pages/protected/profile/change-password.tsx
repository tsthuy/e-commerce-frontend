import { memo, useMemo, useState } from 'react';

import { toast } from 'sonner';
import { z } from 'zod';

import type { DataForm } from '~/types';

import { authApi } from '~/services';

import { useCustomForm } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { Button } from '~/components/common';
import { CustomForm, CustomInputPassword } from '~/components/form';

export const ChangePassword = memo(() => {
  const schema = z
    .object({
      password: z.string().min(1, { message: validates.required.message('Current password') }),
      newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),

      confirmPassword: z.string().min(1, { message: validates.required.message('Confirm password') })
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: validates.password.match,
      path: ['confirmPassword']
    })
    .refine((data) => data.password !== data.newPassword, {
      message: 'New password must be different from current password',
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

      if (response.status == 200) toast.success('Password updated successfully!!!');
      form.reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <h2 className="text-center text-xl font-bold">Change password</h2>
      <CustomForm className="flex flex-col gap-4" provider={form} onSubmit={handleChangePassword}>
        <CustomInputPassword disabled={isLoading} label="Enter your old password" name="password" placeholder="********" />
        <CustomInputPassword disabled={isLoading} label="Enter your new password" name="newPassword" placeholder="********" />
        <CustomInputPassword disabled={isLoading} label="Enter your confirm password" name="confirmPassword" placeholder="********" />

        <Button className="items-end" disabled={isLoading} isLoading={isLoading} type="submit">
          Update
        </Button>
      </CustomForm>
    </div>
  );
});
