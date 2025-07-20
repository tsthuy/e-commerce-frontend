import { memo } from 'react';

import { Link } from 'react-router-dom';

import { DEFAULT_IMG_AVATAR, LOGO, SEO_AUTHOR } from '~/constants';

import { LanguageSwitcher } from '~/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui';

import { useAdminProfile } from '~/hooks/use-admin-profile.hook';
import { ADMIN_AUTH_ROUTES } from '~/routes/admin-auth.route';

export const AdminAuthHeader = memo(() => {
  const { data: admin } = useAdminProfile({});

  return (
    <header className="sticky top-0 z-10 h-header-public w-full border-b bg-white py-2 shadow">
      <div className="relative flex w-full">
        <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] items-center justify-between gap-x-10 px-4">
          <Link className="flex flex-shrink-0 transition-opacity hover:opacity-85" to={ADMIN_AUTH_ROUTES.dashboard.path()}>
            <img alt={SEO_AUTHOR} className="h-[45px] w-auto" src={LOGO} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {admin?.firstName} {admin?.lastName}
              </p>
              <p className="text-xs text-gray-500">{admin?.email || 'admin@admin.com'}</p>
              <p className="text-xs text-blue-600">{admin?.department || 'System Administration'}</p>
            </div>
            <Avatar>
              <AvatarImage alt={admin?.username || 'Admin'} src={DEFAULT_IMG_AVATAR} />
              <AvatarFallback>AD</AvatarFallback>
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
