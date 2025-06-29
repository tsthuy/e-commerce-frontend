import { memo } from 'react';

import Cookie from 'js-cookie';
import { Heart, LogOut, Menu, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { COOKIE_KEYS, DEFAULT_IMG_AVATAR, LOGO, SEO_AUTHOR, SIDEBAR_PUBLIC } from '~/constants';

import { cn } from '~/libs';

import { authApi } from '~/services';

import { useProfile } from '~/hooks';

import { getErrorMessage } from '~/utils';

import { CartIcon } from '~/components/cart';
import { Button } from '~/components/common';
import { SearchBar } from '~/components/layouts/public/header';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '~/components/ui';
import { WishlistIcon } from '~/components/wishlist/wishlist-icon';
import { WishlistSheet } from '~/components/wishlist/wishlist-sheet';

import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from '~/routes';

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

export const UserActions = memo(() => {
  const loggedStatus = !!Cookie.get(COOKIE_KEYS.accessToken) && !!Cookie.get(COOKIE_KEYS.refreshToken);
  const { data: profile } = useProfile({ enabled: loggedStatus });

  const handleLogout = async (): Promise<void> => {
    try {
      await authApi.logout({ data: { directUri: AUTH_ROUTES.login.path() } });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Something went wrong! Please try again.'));
    }
  };
  return (
    <>
      <WishlistSheet>
        <Button size="icon" variant="default">
          <WishlistIcon>
            <Heart className="size-6" color="white" />
          </WishlistIcon>
        </Button>
      </WishlistSheet>
      <CartIcon />
      {loggedStatus ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-[2px] focus:ring-primary focus:ring-offset-2">
            <Avatar>
              <AvatarImage alt="avatar" src={profile?.avatar.url || DEFAULT_IMG_AVATAR} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 gap-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={PROTECTED_ROUTES.profile.path()}>
                <User className="mr-2 size-6" /> Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="mr-2 size-6" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to={AUTH_ROUTES.login.path()}>
          <Avatar>
            <AvatarImage alt="avatar" src={DEFAULT_IMG_AVATAR} />
            <AvatarFallback>GU</AvatarFallback>
          </Avatar>
        </Link>
      )}
    </>
  );
});

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
