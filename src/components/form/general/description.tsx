import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef, memo } from 'react';

import { cn } from '~/libs';

import { FormDescription } from '~/components/ui';

export type CustomFormDescriptionProps = {
  className?: HTMLParagraphElement['className'];
  description?: ReactNode;
};
export const CustomFormDescription = memo(
  forwardRef<HTMLParagraphElement, CustomFormDescriptionProps>(({ description, className }: CustomFormDescriptionProps, ref: ForwardedRef<HTMLParagraphElement>) => {
    return (
      !!description && (
        <FormDescription ref={ref} className={cn('custom-form-description__wrapper', className)}>
          {description}
        </FormDescription>
      )
    );
  })
);
