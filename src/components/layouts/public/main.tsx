import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

type MainPublicLayoutProps = {
  className?: string;
  children: ReactNode;
};

export const MainPublicLayout = memo(({ className, children }: MainPublicLayoutProps) => {
  return <main className={cn('flex-grow', className)}>{children}</main>;
});
