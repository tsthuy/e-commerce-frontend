import { memo, useMemo } from 'react';

import type { CheckboxProps } from '@radix-ui/react-checkbox';
import { useFormContext } from 'react-hook-form';

import { cn } from '~/libs';

import { handleInputError } from '~/utils';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { Checkbox, FormField, FormItem } from '~/components/ui';

type CustomCheckboxProps = Omit<CheckboxProps, 'value'> & {
  name: string;
  className?: HTMLDivElement['className'];
} & {
  classNameInput?: CustomFormControlProps['className'];
} & {
  label?: CustomFormLabelProps['label'];
  classNameLabel?: CustomFormLabelProps['className'];
} & {
  description?: CustomFormDescriptionProps['description'];
  classNameDescription?: CustomFormDescriptionProps['className'];
} & {
  isHiddenErrorMessage?: boolean;
  classNameErrorMessage?: CustomFormMessageProps['className'];
} & {
  fancy?: boolean;
  lineThrough?: boolean;
  align?: 'left' | 'right';
  readOnly?: boolean;
  value?: boolean;
  handleOnCheckedChange?: (value: string | boolean) => void;
};

export const CustomCheckbox = memo((props: CustomCheckboxProps) => {
  const {
    name,
    className,
    classNameInput,
    //
    label,
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
    fancy,
    lineThrough,
    align = 'left',
    value,
    handleOnCheckedChange
  } = props;

  const { formState } = useFormContext();

  const hasError = useMemo(() => handleInputError(name, formState.errors), [name, formState.errors]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', className)}>
          <CustomFormInputWrapper className="w-fit" readOnly={readOnly}>
            <div
              className={cn('custom-form-control__checkbox--wrapper', {
                'custom-form-control__checkbox--readonly': readOnly,
                'custom-form-control__checkbox--invalid': hasError
              })}
            >
              <Checkbox
                checked={value ?? field.value}
                disabled={disabled || readOnly}
                id={name}
                className={cn(
                  'custom-form-control__checkbox',
                  {
                    'custom-form-control__checkbox--fancy': fancy,
                    'order-1': align === 'right'
                  },
                  classNameInput
                )}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleOnCheckedChange?.(checked);
                }}
              />
              <CustomFormLabel
                label={label}
                name={name}
                className={cn(
                  {
                    'custom-form-label__checkbox--line-through': lineThrough
                  },
                  classNameLabel
                )}
              />
            </div>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
