import type { ForwardedRef } from 'react';
import { forwardRef, memo } from 'react';

import { cn } from '~/libs';

import { FormMessage } from '~/components/ui';

export type CustomFormMessageProps = {
  isHidden?: boolean;
  className?: HTMLParagraphElement['className'];
};
export const CustomFormMessage = memo(
  forwardRef<HTMLParagraphElement, CustomFormMessageProps>(({ isHidden, className }: CustomFormMessageProps, ref: ForwardedRef<HTMLParagraphElement>) => {
    return !isHidden && <FormMessage ref={ref} className={cn('custom-form-message__wrapper', className)} />;
  })
);
