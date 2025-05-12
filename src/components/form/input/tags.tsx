import type { InputHTMLAttributes } from 'react';
import { memo, useMemo, useState } from 'react';

import type { Tag } from 'emblor';
import { TagInput } from 'emblor';
import { useFormContext } from 'react-hook-form';

import type { AnyType } from '~/types';

import { cn } from '~/libs';

import { handleInputError } from '~/utils';

import type { CustomFormControlProps, CustomFormDescriptionProps, CustomFormLabelProps, CustomFormMessageProps } from '~/components/form';
import { CustomFormControl, CustomFormDescription, CustomFormInputWrapper, CustomFormLabel, CustomFormMessage } from '~/components/form';
import { FormField, FormItem } from '~/components/ui';

type CustomInputTagsProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
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
  tagStyle?: 'outside' | 'inside';
  handleOnChangeValue?: (value: Array<Tag>) => void;
};

export const CustomInputTags = memo((props: CustomInputTagsProps) => {
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
    tagStyle,
    handleOnChangeValue,
    //
    placeholder,
    disabled,
    readOnly
  } = props;

  const { formState } = useFormContext();

  const [exampleTags, setExampleTags] = useState<Array<Tag>>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const hasError = useMemo(() => handleInputError(name, formState.errors), [name, formState.errors]);
  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic' }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper readOnly={readOnly}>
            <CustomFormControl className={cn('custom-form-control__tags', classNameInput)} readOnly={readOnly}>
              <TagInput
                activeTagIndex={activeTagIndex}
                disabled={disabled}
                inlineTags={tagStyle === 'inside'}
                inputFieldPosition="top"
                placeholder={placeholder ?? ''}
                readOnly={readOnly}
                setActiveTagIndex={setActiveTagIndex}
                tags={field.value ?? exampleTags}
                setTags={(newTags) => {
                  setExampleTags(newTags);
                  field.onChange(newTags);
                  handleOnChangeValue && handleOnChangeValue(newTags as AnyType);
                }}
                styleClasses={{
                  tagList: {
                    container: 'custom-form-control__tags-list'
                  },
                  inlineTagsContainer: `custom-form-control__tags-list--inline ${hasError ? 'custom-form-control__tags-list--invalid' : ''}`,
                  input: `custom-form-control__tags-input ${hasError ? 'custom-form-control__tags-input--invalid' : ''}`,
                  tag: {
                    body: 'custom-form-control__tags-item',
                    closeButton: 'custom-form-control__tags-close'
                  }
                }}
                onBlur={field.onBlur}
              />
            </CustomFormControl>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
