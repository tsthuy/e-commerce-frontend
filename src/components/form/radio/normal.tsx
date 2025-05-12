import { memo, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { cn } from '~/libs';

import { handleInputError } from '~/utils';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, RadioGroup, RadioGroupItem } from '~/components/ui';

type CustomRadioProps = {
  name: string;
  className?: HTMLDivElement['className'];
} & {
  classNameInput?: CustomFormControlProps['className'];
} & {
  classNameLabel?: CustomFormLabelProps['className'];
} & {
  description?: CustomFormDescriptionProps['description'];
  classNameDescription?: CustomFormDescriptionProps['className'];
} & {
  isHiddenErrorMessage?: boolean;
  classNameErrorMessage?: CustomFormMessageProps['className'];
} & {
  readOnly?: boolean;
  disabled?: boolean;
  options: Array<{
    value: string;
    label: CustomFormLabelProps['label'];
    disabled?: boolean;
  }>;
} & {
  handleOnChangeValue?: (value: string) => void;
};

export const CustomRadio = memo((props: CustomRadioProps) => {
  const {
    name,
    className,
    classNameInput,
    //
    classNameLabel,
    //
    description,
    classNameDescription,
    //
    isHiddenErrorMessage,
    classNameErrorMessage,
    //
    readOnly,
    disabled,
    options,
    //
    handleOnChangeValue
  } = props;

  const { formState } = useFormContext();

  const hasError = useMemo(() => handleInputError(name, formState.errors), [name, formState.errors]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', className)}>
          <CustomFormInputWrapper className="w-fit" readOnly={readOnly}>
            <RadioGroup
              disabled={disabled || readOnly}
              value={field.value}
              className={cn('custom-form-control__radios--wrapper', {
                'custom-form-control__radios--readonly': readOnly
              })}
              onValueChange={(value) => {
                field.onChange(value);
                handleOnChangeValue?.(value);
              }}
            >
              {options.map(({ value, label, disabled }) => (
                <div
                  key={value}
                  className={cn('custom-form-control__radio--wrapper', {
                    'custom-form-control__radio--disabled': disabled,
                    'custom-form-control__radio--invalid': hasError
                  })}
                >
                  <RadioGroupItem className={cn('custom-form-control__radio', classNameInput)} disabled={disabled} id={`${name}-${value}`} value={value} />
                  <CustomFormLabel className={cn(classNameLabel)} label={label} name={`${name}-${value}`} />
                </div>
              ))}
            </RadioGroup>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
