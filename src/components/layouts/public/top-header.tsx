import { memo } from 'react';

import { CircleUserRound, Heart, Menu, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { LOGO, SEO_AUTHOR, SIDEBAR_PUBLIC } from '~/constants';

import { cn } from '~/libs';

import { Button } from '~/components/common';
import { SearchBar } from '~/components/layouts/public/header';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '~/components/ui';

import { PUBLIC_ROUTES } from '~/routes';

export const TopHeaderPublicLayout = memo(() => {
  return (
    <header className="sticky top-0 z-10 h-header-public w-full border-b bg-white py-2 shadow">
      <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] items-center justify-between gap-x-10 px-4">
        <Link className="flex flex-shrink-0 transition-opacity hover:opacity-85" to={PUBLIC_ROUTES.index.path()}>
          <img alt={SEO_AUTHOR} className="h-[45px] w-auto" src={LOGO} />
        </Link>

        <NavItems className="hidden lg:flex" />

        <div className="flex flex-shrink-0 gap-x-4">
          <div className="hidden gap-x-2 md:flex">
            <UserActions />
          </div>
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="default">
                  <Menu className="size-6" color="white" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[380px] sm:w-[400px]" side="right">
                <div className="flex flex-col gap-6 p-4">
                  <SearchBar />
                  <NavItems isMobile className="flex-col gap-y-4" />
                  <div className="flex w-full justify-around pt-4">
                    <UserActions />
                  </div>
                </div>
              </SheetContent>
              <SheetClose></SheetClose>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
});

export const UserActions = memo(() => (
  <>
    <Button size="icon" variant="default">
      <Heart className="size-6" color="white" />
    </Button>
    <Button size="icon" variant="default">
      <ShoppingCart className="size-6" color="white" />
    </Button>
    <Button size="icon" variant="default">
      <CircleUserRound className="size-6" color="white" />
    </Button>
  </>
));

export const NavItems = memo(({ className, isMobile = false }: { className?: string; isMobile?: boolean }) => {
  const { pathname } = useLocation();

  return (
    <ul className={cn('flex flex-shrink-0 items-center gap-x-6', className)}>
      {SIDEBAR_PUBLIC.map(({ menu }, index1) =>
        menu.map(({ label, href }, index2) => (
          <li key={`${index1}-${index2}`}>
            {isMobile ? (
              <SheetClose asChild>
                <Link
                  to={href}
                  className={cn('block text-base transition-all hover:text-custom-green', {
                    '!text-custom-green underline underline-offset-4': href === PUBLIC_ROUTES.index.path() ? pathname === href : pathname.includes(href)
                  })}
                >
                  {label}
                </Link>
              </SheetClose>
            ) : (
              <Link
                to={href}
                className={cn('block text-base transition-all hover:text-custom-green', {
                  '!text-custom-green underline underline-offset-4': href === PUBLIC_ROUTES.index.path() ? pathname === href : pathname.includes(href)
                })}
              >
                {label}
              </Link>
            )}
          </li>
        ))
      )}
    </ul>
  );
});
