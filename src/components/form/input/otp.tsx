import type { InputHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { cn } from '~/libs';

import { handleInputError } from '~/utils';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/ui';

type CustomInputOTPProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
  name: string;
  className?: HTMLDivElement['className'];
  isRequired?: boolean;
} & {
  classNameInput?: CustomFormControlProps['className'];
} & {
  label?: CustomFormLabelProps['label'];
  labelStyle?: CustomFormLabelProps['style'];
  classNameLabel?: CustomFormLabelProps['className'];
} & {
  description?: CustomFormDescriptionProps['description'];
  classNameDescription?: CustomFormDescriptionProps['className'];
} & {
  isHiddenErrorMessage?: boolean;
  classNameErrorMessage?: CustomFormMessageProps['className'];
} & {
  count?: number;
  classNameOTP?: string;
};

export const CustomInputOTP = memo((props: CustomInputOTPProps) => {
  const {
    name,
    className,
    classNameInput,
    isRequired,
    //
    label,
    labelStyle = 'normal',
    classNameLabel,
    //
    description,
    classNameDescription,
    //
    isHiddenErrorMessage,
    classNameErrorMessage,
    //
    count = 6,
    classNameOTP,
    //
    disabled,
    readOnly
  } = props;

  const { formState } = useFormContext();

  const hasError = useMemo(() => handleInputError(name, formState.errors), [name, formState.errors]);
  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={readOnly}>
            <CustomFormControl className={cn('custom-form-control__otp', classNameInput)} readOnly={readOnly}>
              <InputOTP
                {...field}
                disabled={disabled}
                maxLength={count}
                readOnly={readOnly}
                containerClassName={cn(
                  {
                    'custom-form-control__otp--invalid': hasError
                  },
                  classNameOTP
                )}
              >
                <InputOTPGroup>
                  {[...new Array(count)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </CustomFormControl>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
