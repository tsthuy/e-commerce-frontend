import { memo, useMemo, useState } from 'react';

import { MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { SEO_AUTHOR } from '~/constants';

import type { DataForm } from '~/types';

import { getErrorMessage, validates } from '~/utils';

import { AuthLayoutContent } from '~/layouts';

import { Button, Helmet } from '~/components/common';
import { CustomForm, CustomInput } from '~/components/form';

export const ForgotPasswordPage = memo(() => {
  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, {
            message: validates.required.message('Email')
          })
          .refine((value) => validates.email.pattern.test(value), validates.email.message)
      }),
    []
  );
  const defaultValues = useMemo(
    () => ({
      email: 'doughdevx@gmail.com'
    }),
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendPasswordResetEmail = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const {} = values;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Something went wrong! Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Helmet title={`Sign in to ${SEO_AUTHOR}`}>
      <AuthLayoutContent>
        <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleSendPasswordResetEmail}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Forgot password</h1>
              <p className="text-balance text-muted-foreground">Enter your user account's verified email address and we will send you a password reset link.</p>
            </div>
            <div>
              <CustomInput isRequired disabled={isLoading} label="Email" name="email" placeholder="example@gmail.com" startIcon={MailIcon} type="email" />
            </div>
            <Button className="w-full" disabled={isLoading} isLoading={isLoading} type="submit">
              Send password reset email
            </Button>
          </div>
        </CustomForm>
      </AuthLayoutContent>
    </Helmet>
  );
});
