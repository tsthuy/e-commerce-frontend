import { memo } from 'react';

import { cn } from '~/libs';

import { SpinnerRing } from '~/components/common';

export type CustomFormInputSpinnerProps = {
  className?: string;
};
export const CustomFormInputSpinner = memo(({ className }: CustomFormInputSpinnerProps) => {
  return (
    <span className={cn('custom-form-spinner__wrapper absolute right-3 top-1/2 flex -translate-y-1/2', className)}>
      <SpinnerRing className="!size-4 [&>*]:!stroke-muted-foreground [&>*]:!transition-colors [&>*]:hover:!stroke-foreground" />
    </span>
  );
});
