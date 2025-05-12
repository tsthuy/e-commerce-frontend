import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef, memo, useMemo } from 'react';

import { cn } from '~/libs';

import { FormLabel } from '~/components/ui';

export type CustomFormLabelProps = {
  name: string;
  isRequired?: boolean;
  className?: HTMLLabelElement['className'];
  label?: ReactNode;
  style?: 'normal' | 'overlap' | 'dynamic' | 'inset';
};
export const CustomFormLabel = memo(
  forwardRef<HTMLLabelElement, CustomFormLabelProps>(({ name, label, style = 'normal', className, isRequired }: CustomFormLabelProps, ref: ForwardedRef<HTMLLabelElement>) => {
    const styleClassName = useMemo(() => (style !== 'normal' ? `custom-form-label--${style}` : ''), [style]);

    return (
      !!label && (
        <FormLabel ref={ref} className={cn('custom-form-label__wrapper', styleClassName, className)} htmlFor={name}>
          {label} {isRequired && <span className="custom-form-label__required">*</span>}
        </FormLabel>
      )
    );
  })
);
