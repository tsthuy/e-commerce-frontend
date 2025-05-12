import type { InputHTMLAttributes } from 'react';
import { memo, useMemo } from 'react';

import { cn } from '~/libs';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputSpinnerProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormDescription, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import type { Option } from '~/components/ui';
import { FormField, FormItem, MultipleSelector } from '~/components/ui';

type CustomMultiSelectProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  options: Array<Option>;
  maxSelected?: number;
  handleOnChangeValue?: (value: Array<Option>) => void;
  handleOnMaxSelected?: (maxLimit: number) => void;
} & {
  hideClearAllButton?: boolean;
};

export const CustomMultiSelect = memo((props: CustomMultiSelectProps) => {
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
    options,
    maxSelected,
    handleOnChangeValue,
    handleOnMaxSelected,
    //
    placeholder,
    disabled,
    readOnly,
    //
    hideClearAllButton
  } = props;

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
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
              <MultipleSelector
                className={cn('custom-form-control__wrapper custom-form-control__select-multiple', classNameInput)}
                disabled={disabled}
                emptyIndicator={<p className="text-center text-sm">No results found.</p>}
                hideClearAllButton={hideClearAllButton}
                maxSelected={maxSelected}
                options={options}
                placeholder={placeholder}
                value={field.value}
                commandProps={{
                  label: placeholder
                }}
                onMaxSelected={handleOnMaxSelected}
                onChange={(value) => {
                  field.onChange(value);
                  handleOnChangeValue?.(value);
                }}
              />
              {isLoading && <CustomFormInputSpinner className={classNameLoading} />}
            </CustomFormInputWrapper>
            <CustomFormDescription className={classNameDescription} description={description} />
            <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
          </FormItem>
        );
      }}
    />
  );
});
