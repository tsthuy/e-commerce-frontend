import { memo } from 'react';

import { Link } from 'react-router-dom';

import { DEFAULT_IMG_AVATAR, LOGO, SEO_AUTHOR } from '~/constants';

import { useSellerProfile } from '~/hooks';

import { LanguageSwitcher } from '~/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui';

import { SELLER_ROUTES } from '~/routes';

export const SellerHeader = memo(() => {
  const { data: seller } = useSellerProfile({});

  return (
    <header className="sticky top-0 z-10 h-header-public w-full border-b bg-white py-2 shadow">
      <div className="relative flex w-full">
        <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] items-center justify-between gap-x-10 px-4">
          <Link className="flex flex-shrink-0 transition-opacity hover:opacity-85" to={SELLER_ROUTES.dashboard.path()}>
            <img alt={SEO_AUTHOR} className="h-[45px] w-auto" src={LOGO} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{seller?.shopName || 'Shop Name'}</p>
              <p className="text-xs text-gray-500">{seller?.email || 'Email'}</p>
            </div>
            <Avatar>
              <AvatarImage alt={seller?.shopName || 'Shop'} src={seller?.shopAvatar?.url || DEFAULT_IMG_AVATAR} />
              <AvatarFallback>{seller?.shopName?.substring(0, 2).toUpperCase() || 'S'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
});
