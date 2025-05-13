import type { ReactNode } from 'react';
import { memo } from 'react';

import { cn } from '~/libs';

type ContainerProps = {
  isFullWidth?: boolean;
  isFitScreen?: boolean;
  className?: string;
  children: ReactNode;
};

export const Container = memo(({ isFullWidth, isFitScreen, className, children }: ContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[calc(1280px+4px*4*2)]',
        {
          'max-w-full px-0': isFullWidth,
          'h-[calc(100svh-(var(--header-public)*2)-(var(--footer-public)))]': isFitScreen
        },
        className
      )}
    >
      {children}
    </div>
  );
});
