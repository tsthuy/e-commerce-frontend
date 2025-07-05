import { memo } from 'react';

import { Link } from 'react-router-dom';

import { DEFAULT_IMG_AVATAR, LOGO, SEO_AUTHOR } from '~/constants';

import { LanguageSwitcher } from '~/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui';

import { SELLER_ROUTES } from '~/routes';

export const SellerHeader = memo(() => {
  return (
    <header className="sticky top-0 z-10 h-header-public w-full border-b bg-white py-2 shadow">
      <div className="relative flex w-full">
        <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] items-center justify-between gap-x-10 px-4">
          <Link className="flex flex-shrink-0 transition-opacity hover:opacity-85" to={SELLER_ROUTES.dashboard.path()}>
            <img alt={SEO_AUTHOR} className="h-[45px] w-auto" src={LOGO} />
          </Link>

          <Avatar>
            <AvatarImage alt="avatar" src={DEFAULT_IMG_AVATAR} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
});
