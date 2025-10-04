import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

type MainProtectedCustomerLayoutProps = {
  className?: string;
  children: ReactNode;
};

export const MainProtectedCustomerLayout = memo(({ className, children }: MainProtectedCustomerLayoutProps) => {
  return <main className={cn('flex h-full w-full', className)}>{children}</main>;
});
