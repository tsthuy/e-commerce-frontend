import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

type MainAdminLayoutProps = {
  className?: string;
  children: ReactNode;
};

export const AdminAuthMainLayout = memo(({ className, children }: MainAdminLayoutProps) => {
  return <main className={cn('flex h-full w-full', className)}>{children}</main>;
});
