import { memo, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import type { AnyType } from '~/types';

import { cn } from '~/libs';

import { handleInputError } from '~/utils';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Switch } from '~/components/ui';

type CustomSwitchProps = {
  name: string;
  className?: HTMLDivElement['className'];
} & {
  classNameInput?: CustomFormControlProps['className'];
} & {
  side?: 'one' | 'both';
  labelStyle?: 'normal' | 'dynamic';
} & (
    | ({
        side?: 'one';
      } & (
        | {
            labelStyle?: 'normal';
            label?: CustomFormLabelProps['label'];
            classNameLabel?: CustomFormLabelProps['className'];
          }
        | {
            labelStyle?: 'dynamic';
            labelOff?: CustomFormLabelProps['label'];
            classNameLabelOff?: CustomFormLabelProps['className'];
            labelOn?: CustomFormLabelProps['label'];
            classNameLabelOn?: CustomFormLabelProps['className'];
          }
      ))
    | {
        side?: 'both';
        labelLeft?: CustomFormLabelProps['label'];
        classNameLabelLeft?: CustomFormLabelProps['className'];
        labelRight?: CustomFormLabelProps['label'];
        classNameLabelRight?: CustomFormLabelProps['className'];
      }
  ) & {
    description?: CustomFormDescriptionProps['description'];
    classNameDescription?: CustomFormDescriptionProps['className'];
  } & {
    isHiddenErrorMessage?: boolean;
    classNameErrorMessage?: CustomFormMessageProps['className'];
  } & {
    readOnly?: boolean;
    disabled?: boolean;
  };

export const CustomSwitch = memo((props: CustomSwitchProps) => {
  const {
    name,
    className,
    classNameInput,
    //
    side = 'one',
    labelStyle = 'normal',
    //
    description,
    classNameDescription,
    //
    isHiddenErrorMessage,
    classNameErrorMessage,
    //
    readOnly,
    disabled,
    //
    ...otherProps
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
              className={cn('custom-form-control__switch--wrapper', {
                'custom-form-control__switch--disabled': disabled,
                'custom-form-control__switch--readonly': readOnly,
                'custom-form-control__switch--invalid': hasError
              })}
            >
              {side === 'both' && (
                <CustomFormLabel
                  label={(otherProps as AnyType).labelLeft}
                  name={name}
                  className={cn(
                    {
                      'text-muted-foreground': field.value
                    },
                    (otherProps as AnyType).classNameLabelLeft
                  )}
                />
              )}
              <Switch checked={field.value} className={cn('custom-form-control__switch', classNameInput)} disabled={disabled || readOnly} id={name} onCheckedChange={field.onChange} />
              {side === 'one' ? (
                labelStyle === 'normal' ? (
                  <CustomFormLabel className={cn((otherProps as AnyType).classNameLabel)} label={(otherProps as AnyType).label} name={name} />
                ) : labelStyle === 'dynamic' ? (
                  <CustomFormLabel
                    className={cn(field.value ? (otherProps as AnyType).classNameLabelOn : (otherProps as AnyType).classNameLabelOff)}
                    label={field.value ? (otherProps as AnyType).labelOn : (otherProps as AnyType).labelOff}
                    name={name}
                  />
                ) : null
              ) : side === 'both' ? (
                <CustomFormLabel
                  label={(otherProps as AnyType).labelRight}
                  name={name}
                  className={cn(
                    {
                      'text-muted-foreground': !field.value
                    },
                    (otherProps as AnyType).classNameLabelRight
                  )}
                />
              ) : null}
            </div>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
