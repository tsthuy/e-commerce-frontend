import { memo, useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import Cookie from 'js-cookie';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { COOKIE_KEYS } from '~/constants';

import { authApi } from '~/services';

import { getErrorMessage } from '~/utils';

import { LoadingScreen } from '~/components/common';
import { AdminAuthHeader, AdminAuthMainLayout, AdminAuthSideBar } from '~/components/layouts/admin/admin-auth';

import { useAdminProfile } from '~/hooks/use-admin-profile.hook';
import { ADMIN_AUTH_ROUTES } from '~/routes/admin-auth.route';

export const AdminAuthLayout = memo(() => {
  const location = useLocation();

  const loggedStatus = !!Cookie.get(COOKIE_KEYS.accessToken) && !!Cookie.get(COOKIE_KEYS.refreshToken);
  const { isSuccess: isSuccessProfile, isError: isErrorProfile } = useAdminProfile({ enabled: loggedStatus, retry: 1 });

  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(loggedStatus);

  useEffect(() => {
    if (isSuccessProfile) setIsLoadingScreen(false);
  }, [isSuccessProfile]);

  useEffect(() => {
    if (isErrorProfile) handleLogout();
  }, [isErrorProfile]);

  const handleLogout = async (): Promise<void> => {
    try {
      await authApi.logout({ data: { directUri: ADMIN_AUTH_ROUTES.login.path() } });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Something went wrong! Please try again.'));
    }
  };

  if (!loggedStatus) return <Redirect to={ADMIN_AUTH_ROUTES.login.path()} />;

  if (isLoadingScreen) return <LoadingScreen />;

  return (
    <>
      <AdminAuthHeader />

      <AdminAuthMainLayout>
        <AdminAuthSideBar />
        <div className="ml-64 min-h-[calc(100vh-var(--header-public))] flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <Switch key={location.pathname} location={location}>
              {Object.values(ADMIN_AUTH_ROUTES).map(
                ({ path, Element }) =>
                  !!Element && (
                    <Route key={path()} exact path={path()}>
                      <Element />
                    </Route>
                  )
              )}

              {/* <Redirect to={OTHER_ROUTES[404].path()} /> */}
            </Switch>
          </AnimatePresence>
        </div>
      </AdminAuthMainLayout>
    </>
  );
});
