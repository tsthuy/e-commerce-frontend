import type { InputHTMLAttributes } from 'react';
import { memo, useCallback, useMemo } from 'react';

import { SearchIcon, XCircleIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { InputEvent } from '~/types';

import { cn } from '~/libs';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputIcon, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Input } from '~/components/ui';

type CustomInputSearchProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
} & {
  handleOnChange?: (value: InputEvent) => void;
  handleOnClearSearch?: () => void;
};

export const CustomInputSearch = memo((props: CustomInputSearchProps) => {
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
    //
    handleOnChange,
    handleOnClearSearch,
    //
    placeholder,
    //
    ...otherProps
  } = props;

  const { setValue } = useFormContext();

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  const handleClearSearch = useCallback((): void => {
    setValue(name, '');
    handleOnClearSearch && handleOnClearSearch();
  }, []);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={otherProps.readOnly}>
            {isLoading ? <CustomFormInputSpinner className="left-3 right-auto" /> : <CustomFormInputIcon align="left" icon={SearchIcon} />}
            <CustomFormControl haveEndIcon haveStartIcon className={cn('custom-form-control__search', classNameInput)} readOnly={otherProps.readOnly}>
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
            {!!field.value && <CustomFormInputIcon align="right" className="!cursor-pointer hover:!text-destructive" handleOnClick={handleClearSearch} icon={XCircleIcon} tooltip="Clear" />}
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
