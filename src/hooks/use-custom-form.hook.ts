import { zodResolver } from '@hookform/resolvers/zod';
import type { ArrayPath, FieldValues } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import type { ZodSchema } from 'zod';

import type { FormOptions, ReturnForm } from '~/types';

/**
 * A custom hook for managing forms with validation using Zod and React Hook Form.
 *
 * @param {ZodSchema<T>} [schema] - Optional Zod schema for form validation.
 * @param {FormOptions<T>} [options] - Optional configuration options for the form.
 * @returns {ReturnForm<T>} - An object containing the form methods and field array methods.
 *
 * @example
 * const MyFormComponent = () => {
 *   const { form, formArray } = useCustomForm<MyFormValues>(myZodSchema, {
 *     mode: 'onBlur',
 *     fieldArray: 'myFieldArray'
 *   });
 *
 *   const { fields, append, remove } = formArray;
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       {fields.map((field, index) => (
 *         <div key={field.id}>
 *           <input {...form.register(`myFieldArray.${index}.name`)} />
 *           <button type="button" onClick={() => remove(index)}>Remove</button>
 *         </div>
 *       ))}
 *       <button type="button" onClick={() => append({ name: '' })}>Add</button>
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * };
 */

export function useCustomForm<T extends FieldValues>(schema?: ZodSchema<T>, options?: FormOptions<T>): ReturnForm<T> {
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: options?.mode || 'all',
    reValidateMode: options?.reValidateMode || 'onSubmit',
    ...options
  });

  const formArray = useFieldArray<T>({
    name: options?.fieldArray as ArrayPath<T>,
    control: form.control
  });

  return { form, formArray };
}
