import { memo } from 'react';

import { ChevronLeftIcon } from 'lucide-react';

import { LOGO, SEO_AUTHOR } from '~/constants';

import { cn } from '~/libs';

import { useSidebarStore } from '~/stores';

import { Button } from '~/components/ui';

import { Menu } from './menu';

export const SidebarAdminLayout = memo(() => {
  const { isOpen } = useSidebarStore();

  return (
    <aside
      className={cn('fixed left-0 top-0 z-20 h-screen -translate-x-full bg-background transition-[width] duration-300 ease-in-out lg:translate-x-0', {
        'w-sidebar-mobile': !isOpen,
        'w-sidebar-desktop': isOpen
      })}
    >
      <SidebarToggle />
      <div className="relative flex h-full flex-col overflow-y-auto border-r px-3 py-4">
        <Button
          asChild
          variant="link"
          className={cn('mb-8 h-fit !no-underline transition-transform duration-300 ease-in-out', {
            'translate-x-1': !isOpen,
            'translate-x-0': isOpen
          })}
        >
          <div className="flex items-center gap-4">
            <img
              alt={SEO_AUTHOR}
              src={LOGO}
              className={cn('block rounded-sm object-contain object-center', {
                'h-20 w-auto': isOpen,
                'h-auto w-[34px]': !isOpen
              })}
            />
          </div>
        </Button>
        <Menu isOpen={isOpen} />
      </div>
    </aside>
  );
});

const SidebarToggle = memo(() => {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <div className="invisible absolute -right-[16px] top-[12px] z-20 lg:visible">
      <Button className="size-8 rounded-md" size="icon" variant="outline" onClick={toggle}>
        <ChevronLeftIcon
          className={cn('size-4 transition-transform duration-700 ease-in-out', {
            'rotate-180': !isOpen,
            'rotate-0': isOpen
          })}
        />
      </Button>
    </div>
  );
});
