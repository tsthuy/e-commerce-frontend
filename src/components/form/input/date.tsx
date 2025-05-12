import type { InputHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import { CalendarDaysIcon, XCircleIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LANGUAGES } from '~/constants';

import type { AnyType } from '~/types';

import { cn } from '~/libs';

import { formatDate, handleInputError } from '~/utils';

import { Button } from '~/components/common';
import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { Calendar, FormField, FormItem, Popover, PopoverContent, PopoverTrigger } from '~/components/ui';

type CustomInputDateProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  dateFormat?: string;
} & (
    | {
        mode?: 'single';
        handleOnChangeValue?: (value: Date | undefined) => void;
      }
    | {
        mode?: 'range';
        handleOnChangeValue?: (value: { from: Date | undefined; to: Date | undefined }) => void;
      }
  ) & { onDayBlur?: () => void };

export const CustomInputDate = memo((props: CustomInputDateProps) => {
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
    dateFormat = 'DD/MM/YYYY',
    mode = 'single',
    handleOnChangeValue,
    onDayBlur,
    //
    placeholder,
    value,
    disabled,
    readOnly
  } = props;

  const {
    i18n: { language }
  } = useTranslation();
  const { formState, setValue } = useFormContext();

  const hasError = useMemo(() => handleInputError(name, formState.errors), [name, formState.errors]);
  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={readOnly}>
            <CustomFormControl className={cn('custom-form-control__date', classNameInput)} readOnly={readOnly}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    aria-invalid={hasError}
                    disabled={disabled}
                    variant="outline"
                    className={cn('custom-form-control__date-button', {
                      'text-muted-foreground': !(value || field.value)
                    })}
                  >
                    {value || field.value ? (
                      mode === 'single' ? (
                        `${formatDate(value || field.value, dateFormat)}`
                      ) : (
                        `${formatDate((value as AnyType)?.from || field.value?.from, dateFormat)} - ${formatDate((value as AnyType)?.to || field.value?.to, dateFormat)}`
                      )
                    ) : (
                      <span>{mode === 'single' ? `${placeholder || dateFormat.toLowerCase()}` : `${placeholder || dateFormat.toLowerCase()} - ${placeholder || dateFormat.toLowerCase()}`}</span>
                    )}
                    <CalendarDaysIcon className="ml-auto size-4 flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground" />
                    {(value || field.value) && (
                      <span
                        className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue(name, '');
                        }}
                      >
                        <XCircleIcon size={16} />
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-auto p-0">
                  <Calendar
                    initialFocus
                    disabled={disabled}
                    locale={LANGUAGES.find((item) => item.i18n === language)?.locale}
                    mode={mode}
                    selected={value || field.value}
                    onDayBlur={onDayBlur}
                    onSelect={(value: AnyType) => {
                      field.onChange(value);
                      handleOnChangeValue && handleOnChangeValue(value);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </CustomFormControl>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
