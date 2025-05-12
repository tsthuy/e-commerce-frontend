import type { InputHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import { cn } from '~/libs';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputSpinnerProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui';

type CustomSelectProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
} & (
    | {
        statusSelect?: false;
        options: Array<{ value: string; label: string; disabled?: boolean }>;
      }
    | {
        statusSelect: true;
        options: Array<{ value: string; label: string; color: string; disabled?: boolean }>;
      }
  ) & {
    rightIndicator?: boolean;
    handleOnChangeValue?: (value: string) => void;
  };

export const CustomSelect = memo((props: CustomSelectProps) => {
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
    statusSelect,
    options,
    rightIndicator,
    handleOnChangeValue,
    //
    placeholder,
    disabled,
    readOnly,
    value
  } = props;

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel
            isRequired={isRequired}
            label={label}
            name={name}
            style={labelStyle}
            className={cn(
              {
                'custom-form-label__select--dynamic': labelStyle === 'dynamic'
              },
              classNameLabel
            )}
          />
          <CustomFormInputWrapper readOnly={readOnly}>
            <Select
              defaultValue={field.value}
              disabled={disabled || readOnly}
              value={value !== undefined ? value : field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleOnChangeValue && handleOnChangeValue(value);
              }}
            >
              <CustomFormControl
                haveEndIcon={isLoading}
                readOnly={readOnly}
                className={cn(
                  'custom-form-control__normal custom-form-control__select',
                  {
                    'custom-form-control__select--readonly': readOnly,
                    'custom-form-control__select--loading': isLoading
                  },
                  classNameInput
                )}
              >
                <SelectTrigger className="gap-3">
                  <SelectValue placeholder={placeholder ?? ''} />
                </SelectTrigger>
              </CustomFormControl>
              <SelectContent
                className={cn({
                  '[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2': rightIndicator,
                  '[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2':
                    statusSelect
                })}
              >
                {statusSelect
                  ? options.map(({ value, label, color, disabled }) => (
                      <SelectItem key={value} className="cursor-pointer" disabled={disabled} value={value}>
                        <span className="flex items-center gap-2">
                          <StatusDot className={cn('flex-shrink-0', color)} />
                          <span className="truncate">{label}</span>
                        </span>
                      </SelectItem>
                    ))
                  : options.map(({ value, label, disabled }) => (
                      <SelectItem key={value} className="cursor-pointer" disabled={disabled} value={value}>
                        {label}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
            {isLoading && <CustomFormInputSpinner className={classNameLoading} />}
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});

const StatusDot = memo(({ className }: { className?: string }) => {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" height="8" viewBox="0 0 8 8" width="8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
});
