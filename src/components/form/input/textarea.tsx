import type { TextareaHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import type { TextareaEvent } from '~/types';

import { cn } from '~/libs';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputSpinnerProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Textarea } from '~/components/ui';

type CustomInputTextareaProps = Partial<TextareaHTMLAttributes<HTMLTextAreaElement>> & {
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
  haveCountCharacters?: boolean;
  handleOnChange?: (value: TextareaEvent) => void;
};

export const CustomInputTextarea = memo((props: CustomInputTextareaProps) => {
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
    haveCountCharacters,
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
            <CustomFormControl
              haveEndIcon={isLoading}
              readOnly={otherProps.readOnly}
              className={cn(
                'custom-form-control__textarea',
                {
                  'custom-form-control__textarea--counter': haveCountCharacters
                },
                classNameInput
              )}
            >
              <Textarea
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
            {haveCountCharacters && (
              <span className="absolute bottom-2 right-3 text-xs font-medium">
                <span
                  className={cn('text-muted-foreground', {
                    'text-foreground': !!otherProps.maxLength && ((field.value || '').length || 0) === otherProps.maxLength,
                    'text-destructive': !!otherProps.maxLength && ((field.value || '').length || 0) > (otherProps.maxLength as number)
                  })}
                >
                  {(field.value || '').length || 0}
                </span>
                {!!otherProps.maxLength && `/${otherProps.maxLength}`}
              </span>
            )}
            {isLoading && <CustomFormInputSpinner className={classNameLoading} />}
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
