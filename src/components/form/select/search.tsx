import type { InputHTMLAttributes, ReactNode } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';

import { CheckIcon, ChevronDownIcon, XCircleIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { AnyType } from '~/types';

import { cn } from '~/libs';

import { Button } from '~/components/common';
import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormInputIconProps, CustomFormInputSpinnerProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputIcon, CustomFormInputSpinner, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, FormField, FormItem, Popover, PopoverContent, PopoverTrigger } from '~/components/ui';

export type CustomSelectSearchProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
} & {
  options: Array<{ value: string; label: ReactNode; disabled?: boolean; originalData?: AnyType }>;
  modal?: boolean;
  placeholderInputSearch?: string;
  isSearchLoading?: boolean;
  isHiddenBtnClear?: boolean;
  isHiddenSearch?: boolean;
  handleOnSearch?: (value: string) => void;
  handleSelected?: (value: CustomSelectSearchProps['options'][number]) => void;
  handleClear?: () => void;
};

export const CustomSelectSearch = memo((props: CustomSelectSearchProps) => {
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
    //
    options,
    modal,
    placeholderInputSearch,
    isSearchLoading,
    isHiddenBtnClear,
    isHiddenSearch,
    handleOnSearch,
    handleSelected,
    handleClear,
    //
    placeholder,
    disabled,
    readOnly,
    value
  } = props;

  const { setValue } = useFormContext();

  const [open, setOpen] = useState<boolean>(false);

  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  const handleClearSearch = useCallback((): void => {
    if (isHiddenBtnClear) return;

    setValue(name, '');
    handleClear?.();
  }, [isHiddenBtnClear]);

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
                'custom-form-label__select-search--dynamic': labelStyle === 'dynamic'
              },
              classNameLabel
            )}
          />
          <CustomFormInputWrapper readOnly={readOnly}>
            <Popover modal={modal} open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild disabled={disabled || readOnly}>
                <CustomFormControl
                  haveEndIcon={isLoading || (value !== undefined ? !!value : !!field.value)}
                  readOnly={readOnly}
                  className={cn(
                    'custom-form-control__normal custom-form-control__select-search',
                    {
                      'custom-form-control__select-search--readonly': readOnly,
                      'custom-form-control__select-search--loading': isLoading
                    },
                    classNameInput
                  )}
                >
                  <Button
                    data-placeholder={value !== undefined ? !!!value : !!!field.value}
                    data-state={open ? 'open' : 'close'}
                    disabled={disabled || readOnly}
                    rounded={false}
                    variant="outline"
                    className={cn('w-full justify-between px-3 font-normal', {
                      '!pr-3': isHiddenBtnClear
                    })}
                    onClick={() => setOpen(true)}
                  >
                    <div className="items-left inline-flex min-w-0 flex-1">
                      <CustomFormInputIcon align="left" className={cn('relative left-auto right-auto top-auto mr-1 flex-shrink-0 translate-x-0 translate-y-0', classNameStartIcon)} icon={StartIcon} />

                      <span
                        className={cn('truncate', {
                          'text-muted-foreground': value !== undefined ? !!!value : !!!field.value
                        })}
                      >
                        {(value !== undefined ? !!value : !!field.value) ? options.find((option) => option.value === (value !== undefined ? value : field.value))?.label : placeholder || ''}
                      </span>
                    </div>

                    <ChevronDownIcon className={cn('ml-1 size-4 shrink-0')} />
                  </Button>
                </CustomFormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command shouldFilter={false}>
                  {!isHiddenSearch && <CommandInput placeholder={placeholderInputSearch} onValueChange={handleOnSearch} />}
                  <CommandList>
                    {isSearchLoading ? (
                      <CommandEmpty>Type to search...</CommandEmpty>
                    ) : options.length > 0 ? (
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            className="cursor-pointer"
                            disabled={option.disabled}
                            value={option.value}
                            onSelect={() => {
                              field.onChange(option.value);
                              handleSelected && handleSelected(option);
                              setOpen(false);
                            }}
                          >
                            {option.label}
                            {(value !== undefined ? value : field.value) === option.value && <CheckIcon className="ml-auto size-4 flex-shrink-0 pl-1" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>No results.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {isLoading ? (
              <CustomFormInputSpinner className={classNameLoading} />
            ) : (
              (value !== undefined ? !!value : !!field.value) &&
              !!!isHiddenBtnClear && <CustomFormInputIcon align="right" className="!cursor-pointer hover:!text-destructive" handleOnClick={handleClearSearch} icon={XCircleIcon} tooltip="Clear" />
            )}
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
