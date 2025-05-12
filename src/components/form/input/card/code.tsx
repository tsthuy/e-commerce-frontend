import type { InputHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import { CardCvcElement } from '@stripe/react-stripe-js';
import type { StripeCardCvcElementChangeEvent } from '@stripe/stripe-js';

import { cn } from '~/libs';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem } from '~/components/ui';

type CustomInputCardCodeProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  handleOnChange?: (value: StripeCardCvcElementChangeEvent) => void;
};

export const CustomInputCardCode = memo((props: CustomInputCardCodeProps) => {
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
    handleOnChange,
    //
    placeholder,
    readOnly
  } = props;

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={readOnly}>
            <CustomFormControl className={cn('custom-form-control__card-code', classNameInput)} readOnly={readOnly}>
              <CardCvcElement
                options={{
                  placeholder: placeholder || 'CVC',
                  style: {
                    base: {
                      fontSize: '14px',
                      fontWeight: '400',
                      fontFamily: "'Urbanist', sans-serif"
                    }
                  }
                }}
                onBlur={field.onBlur}
                onChange={(event) => {
                  field.onChange(event);
                  handleOnChange && handleOnChange(event);
                }}
              />
            </CustomFormControl>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
