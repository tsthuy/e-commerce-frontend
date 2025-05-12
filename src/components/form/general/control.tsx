import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef, memo } from 'react';

import { cn } from '~/libs';

import { FormControl } from '~/components/ui';

export type CustomFormControlProps = {
  readOnly?: boolean;
  haveStartIcon?: boolean;
  haveEndIcon?: boolean;
  className?: string;
  children: ReactNode;
};
export const CustomFormControl = memo(
  forwardRef<HTMLDivElement, CustomFormControlProps>(({ className, readOnly, haveStartIcon, haveEndIcon, children }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <FormControl
        ref={ref}
        className={cn(
          'custom-form-control__wrapper',
          {
            'cursor-no-drop': readOnly,
            'ps-9': haveStartIcon,
            'pe-9': haveEndIcon
          },
          className
        )}
      >
        {children}
      </FormControl>
    );
  })
);
