import { memo, useEffect, useMemo, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import Cookie from 'js-cookie';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { COOKIE_KEYS } from '~/constants';

import { authApi } from '~/services';

import { useProfile } from '~/hooks';

import { getErrorMessage } from '~/utils';

import { LoadingScreen } from '~/components/common';
import { FooterPublicLayout, HeaderPublicLayout, MainPublicLayout, TopHeaderPublicLayout, WrapperPublicLayout } from '~/components/layouts/public';

import { AUTH_ROUTES, OTHER_ROUTES, PUBLIC_ROUTES } from '~/routes';

export const PublicLayout = memo(() => {
  const location = useLocation();

  const isHiddenHeader = useMemo(() => [OTHER_ROUTES[404].path()].includes(location.pathname), [location]);
  const isHiddenFooter = useMemo(() => [OTHER_ROUTES[404].path()].includes(location.pathname), [location]);

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

  if (isLoadingScreen) return <LoadingScreen />;

  return (
    <WrapperPublicLayout>
      {!isHiddenHeader && <TopHeaderPublicLayout />}
      {!isHiddenHeader && <HeaderPublicLayout />}

      <MainPublicLayout>
        <AnimatePresence mode="wait">
          <Switch key={location.pathname} location={location}>
            {Object.values(PUBLIC_ROUTES).map(
              ({ path, Element }) =>
                !!Element && (
                  <Route key={path()} exact path={path()}>
                    <Element />
                  </Route>
                )
            )}

            {Object.values(OTHER_ROUTES).map(
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
      </MainPublicLayout>
      {!isHiddenFooter && <FooterPublicLayout />}
    </WrapperPublicLayout>
  );
});
