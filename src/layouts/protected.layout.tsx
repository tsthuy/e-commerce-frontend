import { memo, useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import Cookie from 'js-cookie';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { COOKIE_KEYS } from '~/constants';

import { authApi } from '~/services';

import { useProfile } from '~/hooks';

import { getErrorMessage } from '~/utils';

import { LoadingScreen } from '~/components/common';
import { MainProtectedLayout } from '~/components/layouts/protected';
import { FooterPublicLayout, HeaderPublicLayout } from '~/components/layouts/public';

import { AUTH_ROUTES, OTHER_ROUTES, PROTECTED_ROUTES } from '~/routes';

export const ProtectedLayout = memo(() => {
  const location = useLocation();
  const { push } = useHistory();

  const loggedStatus = !!Cookie.get(COOKIE_KEYS.accessToken) && !!Cookie.get(COOKIE_KEYS.refreshToken);

  const { isSuccess: isSuccessProfile, isError: isErrorProfile } = useProfile({ enabled: loggedStatus, retry: 1 });

  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(loggedStatus);

  useEffect(() => {
    if (isSuccessProfile) setIsLoadingScreen(false);
  }, [isSuccessProfile]);

  useEffect(() => {
    if (isErrorProfile) handleLogout();
  }, [isErrorProfile]);

  const handleLogout = async (): Promise<void> => {
    try {
      await authApi.logout({ data: { directUri: AUTH_ROUTES.login.path() } });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Something went wrong! Please try again.'));
    }
  };

  if (!loggedStatus) {
    push(AUTH_ROUTES.login.path());
    return null;
  }

  if (isLoadingScreen) return <LoadingScreen />;

  return (
    <>
      <HeaderPublicLayout />
      <MainProtectedLayout>
        <AnimatePresence mode="wait">
          <Switch key={location.pathname} location={location}>
            {Object.values(PROTECTED_ROUTES).map(
              ({ path, Element }) =>
                !!Element && (
                  <Route key={path()} exact path={path()}>
                    <Element />
                  </Route>
                )
            )}

            <Redirect to={OTHER_ROUTES[404].path()} />
          </Switch>
        </AnimatePresence>
      </MainProtectedLayout>
      <FooterPublicLayout />
    </>
  );
});
