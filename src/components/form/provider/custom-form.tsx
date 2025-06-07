import type { ReactNode, RefObject } from 'react';
import { useEffect, useImperativeHandle } from 'react';

import type { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';

import type { FormOptions, ReferenceForm } from '~/types';

import { useCustomForm } from '~/hooks';

import { Form } from '~/components/ui';

type CustomFormProps<T extends FieldValues> = {
  children: ReactNode;
  schema?: ZodType<T>;
  provider?: UseFormReturn<T>;
  options?: FormOptions<T>;
  className?: string;
  reference?: RefObject<ReferenceForm>;
  isReset?: boolean;
  onResetDone?: () => void;
  onSubmit?: (data: T) => void;
  onError?: (errors: FieldErrors) => void;
  onValid?: (isValid: boolean) => void;
  onSubmitting?: (isSubmitting: boolean) => void;
};

export const CustomForm = <T extends FieldValues = FieldValues>({
  schema,
  provider,
  options,
  className = '',
  reference,
  isReset,
  onResetDone,
  onSubmit,
  onError,
  onValid,
  onSubmitting,
  children
}: CustomFormProps<T>): React.JSX.Element => {
  const { form } = useCustomForm<T>(schema, options);
  const formInstance = provider || form;
  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset
  } = formInstance;

  const submit = (data: T): void => {
    onSubmit && onSubmit(data);
  };

  useImperativeHandle(reference, () => ({
    submitForm(): void {
      handleSubmit(submit)();
    }
  }));

  useEffect(() => {
    onValid && onValid(isValid);
  }, [isValid]);

  useEffect(() => {
    onSubmitting && onSubmitting(isSubmitting);
  }, [isSubmitting]);

  useEffect(() => {
    if (!onError || Object.keys(errors).length === 0) return;

    onError(errors);
  }, [errors]);

  useEffect(() => {
    if (isReset) {
      reset();
      onResetDone && onResetDone();
    }
  }, [isReset]);

  return (
    <Form {...formInstance}>
      <form className={className} onSubmit={handleSubmit(submit)}>
        {children}
      </form>
    </Form>
  );
};
