import type { InputHTMLAttributes } from 'react';
import { memo, useMemo, useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import type { InputEvent } from '~/types';

import { cn } from '~/libs';

import { Tooltip } from '~/components/common';
import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputIconProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputIcon, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Input } from '~/components/ui';

type CustomInputPasswordProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  startIcon?: CustomFormInputIconProps['icon'];
  classNameStartIcon?: CustomFormInputIconProps['className'];
} & {
  handleOnChange?: (value: InputEvent) => void;
};

export const CustomInputPassword = memo((props: CustomInputPasswordProps) => {
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
    startIcon: StartIcon,
    classNameStartIcon,
    //
    handleOnChange,
    //
    placeholder,
    //
    ...otherProps
  } = props;
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={otherProps.readOnly}>
            <CustomFormInputIcon align="left" className={classNameStartIcon} icon={StartIcon} />
            <CustomFormControl haveEndIcon className={cn('custom-form-control__normal', classNameInput)} haveStartIcon={!!StartIcon} readOnly={otherProps.readOnly}>
              <Input
                {...field}
                {...otherProps}
                autoComplete="off"
                placeholder={placeholder ?? ''}
                type={isShowPassword ? 'text' : 'password'}
                onChange={(event) => {
                  field.onChange(event);
                  handleOnChange && handleOnChange(event);
                }}
              />
            </CustomFormControl>
            <Tooltip content={isShowPassword ? 'Show password' : 'Hide password'} side="top">
              <span
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsShowPassword((prev) => !prev)}
              >
                {isShowPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </span>
            </Tooltip>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
