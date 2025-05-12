import type { InputHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Value as PhoneInputValue } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input';

import { LANGUAGES } from '~/constants';

import { cn } from '~/libs';

import { handleInputError } from '~/utils';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputSpinnerProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem } from '~/components/ui';

type CustomInputTelProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  handleOnChangeValue?: (value: PhoneInputValue | string) => void;
};

export const CustomInputTel = memo((props: CustomInputTelProps) => {
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
    handleOnChangeValue,
    //
    placeholder,
    disabled,
    readOnly
  } = props;

  const {
    i18n: { language }
  } = useTranslation();
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
            <CustomFormControl className={cn('custom-form-control__tel', classNameInput)} haveEndIcon={isLoading} readOnly={readOnly}>
              <PhoneInput
                {...field}
                international
                autoComplete="off"
                defaultCountry={LANGUAGES.find((item) => item.i18n === language)?.country}
                disabled={disabled}
                placeholder={placeholder}
                readOnly={readOnly}
                className={cn({
                  'custom-form-control__tel--invalid': hasError
                })}
                onChange={(value) => {
                  field.onChange(value || '');
                  handleOnChangeValue && handleOnChangeValue(value || '');
                }}
              />
            </CustomFormControl>
            {isLoading && <CustomFormInputSpinner className={classNameLoading} />}
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
