import type { InputHTMLAttributes } from 'react';
import { memo, useCallback, useMemo } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { NumericFormat, PatternFormat } from 'react-number-format';

import { cn } from '~/libs';

import { Button } from '~/components/common';
import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputIconProps, CustomFormInputSpinnerProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputIcon, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Input } from '~/components/ui';

import 'react-phone-number-input/style.css';

type CustomInputNumberProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  haveChevrons?: boolean;
  handleOnChangeValue?: (value: string) => void;
} & (
    | {
        format?: string;
        thousandSeparator?: never;
        prefix?: never;
        suffix?: never;
        min?: never;
        max?: never;
      }
    | {
        format?: never;
        thousandSeparator?: string | boolean;
        prefix?: string;
        suffix?: string;
        min?: number;
        max?: number;
      }
  );

export const CustomInputNumber = memo((props: CustomInputNumberProps) => {
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
    thousandSeparator,
    prefix,
    suffix,
    format,
    haveChevrons,
    handleOnChangeValue,
    //
    placeholder = '',
    disabled,
    min,
    max,
    step,
    readOnly,
    value
  } = props;

  const { setValue } = useFormContext();

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  const handleClickChevron = useCallback((value: string, type: 'increase' | 'decrease'): void => {
    const result = Number(value || 0) + (type === 'increase' ? 1 : -1) * Number(step ?? 1);
    setValue(name, String(result));
  }, []);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={readOnly}>
            <CustomFormInputIcon align="left" className={classNameStartIcon} icon={StartIcon} />
            <CustomFormControl className={cn('custom-form-control__number', classNameInput)} haveEndIcon={isLoading || !!EndIcon || haveChevrons} haveStartIcon={!!StartIcon} readOnly={readOnly}>
              {!!!format ? (
                <NumericFormat
                  allowNegative={false}
                  autoComplete="off"
                  customInput={Input}
                  disabled={disabled}
                  max={max}
                  min={min}
                  placeholder={placeholder}
                  prefix={prefix}
                  step={step}
                  suffix={suffix}
                  thousandSeparator={thousandSeparator}
                  value={value !== undefined ? value : field.value}
                  onBlur={field.onBlur}
                  onValueChange={({ value }) => {
                    field.onChange(value);
                    handleOnChangeValue && handleOnChangeValue(value);
                  }}
                />
              ) : (
                <PatternFormat
                  autoComplete="off"
                  customInput={Input}
                  disabled={disabled}
                  format={format}
                  mask=" "
                  placeholder={placeholder}
                  value={value !== undefined ? value : field.value}
                  onBlur={field.onBlur}
                  onValueChange={({ value }) => {
                    field.onChange(value);
                    handleOnChangeValue && handleOnChangeValue(value);
                  }}
                />
              )}
            </CustomFormControl>
            {isLoading ? <CustomFormInputSpinner className={classNameLoading} /> : <CustomFormInputIcon align="right" className={classNameEndIcon} icon={EndIcon} />}
            {haveChevrons && (
              <div className="absolute right-0 top-0 flex h-full flex-col">
                <Button
                  className="w-6 rounded-none rounded-tr-md border-b-0 p-0 text-muted-foreground hover:text-foreground"
                  size="icon"
                  variant="outline"
                  onClick={() => handleClickChevron(field.value, 'increase')}
                >
                  <ChevronUpIcon className="size-3 transition-colors" />
                </Button>
                <Button
                  className="w-6 rounded-none rounded-br-md p-0 text-muted-foreground hover:text-foreground"
                  size="icon"
                  variant="outline"
                  onClick={() => handleClickChevron(field.value, 'decrease')}
                >
                  <ChevronDownIcon className="size-3 transition-colors" />
                </Button>
              </div>
            )}
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
