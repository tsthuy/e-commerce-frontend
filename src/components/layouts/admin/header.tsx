import { memo } from 'react';

import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { DEFAULT_ADMIN_AVATAR, LOGO, SEO_AUTHOR } from '~/constants';

import { authApi } from '~/services';

import { useTranslation } from '~/hooks';

import { getErrorMessage } from '~/utils';

import { LanguageSwitcher } from '~/components/common';
import { Avatar, AvatarFallback, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui';

import { useAdminProfile } from '~/hooks/use-admin-profile.hook';
import { ADMIN_AUTH_ROUTES } from '~/routes/admin-auth.route';

export const AdminAuthHeader = memo(() => {
  const { t } = useTranslation();
  const { data: admin } = useAdminProfile({});

  const handleLogout = async (): Promise<void> => {
    try {
      await authApi.logout({ data: { directUri: ADMIN_AUTH_ROUTES.login.path() } });
      toast.success(t('Auth.loggedOutSuccess'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('Common.somethingWentWrong')));
    }
  };

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
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-[2px] focus:ring-primary focus:ring-offset-2">
                <Avatar>
                  <AvatarImage alt="avatar" className="!object-contain" src={DEFAULT_ADMIN_AVATAR} />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 gap-2">
                <DropdownMenuLabel>{t('Common.AdminActions')}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10" onClick={handleLogout}>
                  <LogOut className="mr-2 size-6" /> {t('Common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <LanguageSwitcher showText={false} />
          </div>
        </div>
      </div>
    </header>
  );
});
