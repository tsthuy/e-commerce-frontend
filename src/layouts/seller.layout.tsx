import { memo, useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { default as Cookie } from 'js-cookie';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { COOKIE_KEYS } from '~/constants';

import { authApi } from '~/services';

import { useSellerProfile, useTranslation } from '~/hooks';

import { getErrorMessage } from '~/utils';

import { LoadingScreen } from '~/components/common';
import { SellerHeader, SellerSideBar } from '~/components/layouts/seller';
import { MainSellerLayout } from '~/components/layouts/seller/main';

import { AUTH_ROUTES, SELLER_ROUTES } from '~/routes';

export const SellerLayout = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();

  const loggedStatus = !!Cookie.get(COOKIE_KEYS.accessToken) && !!Cookie.get(COOKIE_KEYS.refreshToken);
  const { isSuccess: isSuccessProfile, isError: isErrorProfile } = useSellerProfile({ enabled: loggedStatus, retry: 1 });

  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(loggedStatus);

  useEffect(() => {
    if (isSuccessProfile) setIsLoadingScreen(false);
  }, [isSuccessProfile]);

  useEffect(() => {
    if (isErrorProfile) handleLogout();
  }, [isErrorProfile]);

  const handleLogout = async (): Promise<void> => {
    try {
      await authApi.logout({ data: { directUri: AUTH_ROUTES.sellerLogin.path() } });
    } catch (error) {
      toast.error(getErrorMessage(error, t('Common.somethingWentWrong')));
    }
  };

  if (!loggedStatus) return <Redirect to={AUTH_ROUTES.sellerLogin.path()} />;

  if (isLoadingScreen) return <LoadingScreen />;

  return (
    <>
      <SellerHeader />

      <MainSellerLayout>
        <SellerSideBar />
        <div className="ml-64 min-h-[calc(100vh-var(--header-public))] flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <Switch key={location.pathname} location={location}>
              {Object.values(SELLER_ROUTES).map(
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
      </MainSellerLayout>
    </>
  );
});
