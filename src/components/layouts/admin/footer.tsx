import { memo } from 'react';

import { SEO_AUTHOR } from '~/constants';

import { cn } from '~/libs';

import { useSidebarStore } from '~/stores';

export const FooterAdminLayout = memo(() => {
  const { isOpen } = useSidebarStore();

  return (
    <footer
      className={cn('transition-[margin-left] duration-300 ease-in-out', {
        'lg:ml-sidebar-mobile': !isOpen,
        'lg:ml-sidebar-desktop': isOpen
      })}
    >
      <div className="z-20 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-4 flex h-14 items-center md:mx-8">
          <p className="text-left text-xs leading-loose text-muted-foreground md:text-sm">
            © {new Date().getFullYear()} <span className="font-medium text-foreground">{SEO_AUTHOR}</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});
