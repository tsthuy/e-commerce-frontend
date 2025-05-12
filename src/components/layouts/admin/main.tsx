import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

import { useSidebarStore } from '~/stores';

type MainAdminLayoutProps = {
  children: ReactNode;
};

export const MainAdminLayout = memo(({ children }: MainAdminLayoutProps) => {
  const { isOpen } = useSidebarStore();

  return (
    <main
      className={cn('min-h-[calc(100vh-var(--header))] bg-custom-background transition-[margin-left] duration-300 ease-in-out', {
        'lg:ml-sidebar-mobile': !isOpen,
        'lg:ml-sidebar-desktop': isOpen
      })}
    >
      {children}
    </main>
  );
});
