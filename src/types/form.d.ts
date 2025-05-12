import type { ChangeEvent, ReactNode } from 'react';

import type { ArrayPath, FieldValues, UseFieldArrayReturn, UseFormProps, UseFormReturn } from 'react-hook-form';
import type { ZodType, z } from 'zod';

export type FormOptions<T extends FieldValues> = {
  fieldArray?: ArrayPath<T>;
} & UseFormProps<T>;

export type ReturnForm<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formArray: UseFieldArrayReturn<T, ArrayPath<T>, 'id'>;
};

export type ReferenceForm = {
  submitForm: () => void;
};

export type DataForm<T extends ZodType> = z.infer<T>;

export type InputEvent = ChangeEvent<HTMLInputElement>;
export type TextareaEvent = ChangeEvent<HTMLTextAreaElement>;

export type InputProps = {
  name: string;
  label?: ReactNode;
  labelStyle?: 'normal' | 'absolute';
  description?: ReactNode;
  className?: string;
  classNameLabel?: string;
  classNameInput?: string;
  classNameDescription?: string;
  classNameErrorMessage?: string;
  classNameLoading?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  isHiddenLoading?: boolean;
  isHiddenShowPassword?: boolean;
  isHiddenErrorMessage?: boolean;
  handleOnChange?: (value: InputEvent) => void;
  handleOnChangeValue?: (value: string) => void;
};

export type TextareaProps = Omit<InputProps, 'isHiddenShowPassword' | 'handleOnChangeValue'> & {
  showLength?: boolean;
  handleOnChange?: (value: TextareaEvent) => void;
};

export type SelectProps = Omit<InputProps, 'isHiddenShowPassword' | 'handleOnChangeValue' | 'handleOnChange'> & {
  handleOnChange?: (value: string) => void;
  value?: string;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export type MultiSelectProps = SelectProps & {
  handleOnChange?: (value: SelectProps['options']) => void;
  classNameSelect?: string;
};
