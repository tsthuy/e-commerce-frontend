import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

type MainSellerLayoutProps = {
  className?: string;
  children: ReactNode;
};

export const MainSellerLayout = memo(({ className, children }: MainSellerLayoutProps) => {
  return <main className={cn('mx-auto size-full max-w-[calc(1280px+4px*4*2)] flex-grow items-center px-4', className)}>{children}</main>;
});
