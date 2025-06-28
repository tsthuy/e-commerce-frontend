import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

type MainSellerLayoutProps = {
  className?: string;
  children: ReactNode;
};

export const MainSellerLayout = memo(({ className, children }: MainSellerLayoutProps) => {
  return <main className={cn('flex h-full w-full', className)}>{children}</main>;
});
