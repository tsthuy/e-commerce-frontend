import type { ReactNode } from 'react';
import { memo } from 'react';

type WrapperPublicLayoutProps = {
  children: ReactNode;
};

export const WrapperPublicLayout = memo(({ children }: WrapperPublicLayoutProps) => {
  return <div className="flex min-h-svh flex-col">{children}</div>;
});
