import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

import { Tooltip } from '~/components/common';

export type CustomFormInputWrapperProps = {
  content?: string;
  readOnly?: boolean;
  children: ReactNode;
  className?: HTMLDivElement['className'];
};
export const CustomFormInputWrapper = memo(({ content, readOnly, children, className }: CustomFormInputWrapperProps) => {
  return readOnly ? (
    <Tooltip content={content ?? 'Readonly'}>
      <div className={cn('relative !mt-0 cursor-no-drop', className)}>{children}</div>
    </Tooltip>
  ) : (
    <div className={cn('relative !mt-0', className)}>{children}</div>
  );
});
