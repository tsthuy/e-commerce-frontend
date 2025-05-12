import { memo } from 'react';

import { MenuIcon } from 'lucide-react';

import { LOGO, SEO_AUTHOR } from '~/constants';

import { Button, Sheet, SheetContent, SheetHeader, SheetTrigger } from '~/components/ui';

import { Menu } from '../sidebar/menu';

export const SheetMenu = memo(() => {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button className="h-8" size="icon" variant="outline">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button asChild className="flex items-center justify-center pb-2 pt-1 !no-underline" variant="link">
            <div className="flex items-center gap-2">
              <img alt={SEO_AUTHOR} className="block h-14 w-auto rounded-sm object-contain object-center" src={LOGO} />
            </div>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
});
