import type { InputHTMLAttributes } from 'react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { ClockIcon } from 'lucide-react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import type { AnyType, NumberOrNull } from '~/types';

import { cn } from '~/libs';

import { handleInputError, validates } from '~/utils';

import { Button } from '~/components/common';
import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem, Popover, PopoverContent, PopoverTrigger, ScrollArea, ScrollBar } from '~/components/ui';

type CustomInputTimeProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  step?: number;
  mask?: string;
  handleOnChangeValue?: (value: AnyType) => void;
};

type TimeSelectorProps = {
  type: 'hour' | 'minute';
  selectedValue: NumberOrNull;
  onChange: (value: number) => void;
  step?: number;
  mask?: string;
};

export const CustomInputTime = memo((props: CustomInputTimeProps) => {
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
    step,
    mask,
    handleOnChangeValue,
    //
    placeholder,
    value,
    disabled,
    readOnly
  } = props;

  const { formState } = useFormContext();

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);

  const hasError = useMemo(() => handleInputError(name, formState.errors), [name, formState.errors]);
  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  const handleTimeChange = (type: 'hour' | 'minute', value: number, field: ControllerRenderProps): void => {
    let newHour = hour;
    let newMinute = minute;
    if (type === 'hour') {
      setHour(value);
      newHour = value;
    } else if (type === 'minute') {
      setMinute(value);
      newMinute = value;
    }
    const timeString = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    field.onChange(timeString);
    handleOnChangeValue?.(timeString);
  };

  useEffect(() => {
    if (!formState.isDirty) {
      setHour(0);
      setMinute(0);
    }
  }, [formState.isDirty]);

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
                    {validates.time.pattern.test(value || field.value) ? value || field.value : <span className="text-muted-foreground">{placeholder || '--:--'}</span>}
                    <ClockIcon className="ml-auto size-4 flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-auto p-0">
                  <div className="flex h-[300px] flex-row divide-x pt-2">
                    <TimeSelector
                      mask={mask}
                      selectedValue={validates.time.pattern.test(value || field.value) ? parseInt(field.value?.split(':')[0]) : null}
                      type="hour"
                      onChange={(value: number) => handleTimeChange('hour', value, field)}
                    />
                    <TimeSelector
                      mask={mask}
                      selectedValue={validates.time.pattern.test(value || field.value) ? parseInt(field.value?.split(':')[1]) : null}
                      step={step}
                      type="minute"
                      onChange={(value: number) => handleTimeChange('minute', value, field)}
                    />
                  </div>
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

const TimeSelector = ({ type, selectedValue, onChange, step, mask }: TimeSelectorProps): JSX.Element => {
  const values = Array.from({ length: Math.ceil((type === 'hour' ? 24 : 60) / (step || 1)) }, (_, i) => i * (step || 1));
  const maskTime = mask && validates.time.pattern.test(mask) ? parseInt(mask.split(':')[type === 'hour' ? 0 : 1]) : null;

  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, []);

  return (
    <ScrollArea className="w-auto">
      <div className="flex flex-col p-2">
        {values.map((value) => (
          <Button
            key={value}
            ref={selectedValue === value || (!selectedValue && maskTime === value) ? selectedRef : null}
            size="icon"
            variant={selectedValue === value ? 'default' : 'ghost'}
            onClick={() => onChange(value)}
          >
            {value.toString().padStart(2, '0')}
          </Button>
        ))}
      </div>
      <ScrollBar className="sm:hidden" orientation="horizontal" />
    </ScrollArea>
  );
};
