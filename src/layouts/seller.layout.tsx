import { memo } from 'react';

import { AnimatePresence } from 'framer-motion';
import { Route, Switch, useLocation } from 'react-router-dom';

import { SellerHeader, SellerSideBar } from '~/components/layouts/seller';
import { MainSellerLayout } from '~/components/layouts/seller/main';

import { SELLER_ROUTES } from '~/routes';

export const SellerLayout = memo(() => {
  const location = useLocation();

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
