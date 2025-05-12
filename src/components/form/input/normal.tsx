import type { InputHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import type { InputEvent } from '~/types';

import { cn } from '~/libs';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputIconProps, CustomFormInputSpinnerProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputIcon, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Input } from '~/components/ui';

type CustomInputProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  isLoading?: boolean;
  classNameLoading?: CustomFormInputSpinnerProps['className'];
} & {
  startIcon?: CustomFormInputIconProps['icon'];
  classNameStartIcon?: CustomFormInputIconProps['className'];
  endIcon?: CustomFormInputIconProps['icon'];
  classNameEndIcon?: CustomFormInputIconProps['className'];
} & {
  handleOnChange?: (value: InputEvent) => void;
};

export const CustomInput = memo((props: CustomInputProps) => {
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
    isLoading,
    classNameLoading,
    //
    startIcon: StartIcon,
    classNameStartIcon,
    endIcon: EndIcon,
    classNameEndIcon,
    //
    handleOnChange,
    //
    placeholder,
    //
    ...otherProps
  } = props;

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={otherProps.readOnly}>
            <CustomFormInputIcon align="left" className={classNameStartIcon} icon={StartIcon} />
            <CustomFormControl className={cn('custom-form-control__normal', classNameInput)} haveEndIcon={isLoading ?? !!EndIcon} haveStartIcon={!!StartIcon} readOnly={otherProps.readOnly}>
              <Input
                {...field}
                {...otherProps}
                autoComplete="off"
                placeholder={placeholder ?? ''}
                onChange={(event) => {
                  field.onChange(event);
                  handleOnChange && handleOnChange(event);
                }}
              />
            </CustomFormControl>
            {isLoading ? <CustomFormInputSpinner className={classNameLoading} /> : <CustomFormInputIcon align="right" className={classNameEndIcon} icon={EndIcon} />}
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
