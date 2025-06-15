import { memo } from 'react';

import { AnimatePresence } from 'framer-motion';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { SellerHeader } from '~/components/layouts/seller';
import { MainSellerLayout } from '~/components/layouts/seller/main';

import { OTHER_ROUTES, SELLER_ROUTES } from '~/routes';

export const SellerLayout = memo(() => {
  const location = useLocation();

  return (
    <>
      <SellerHeader />
      <MainSellerLayout>
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

            <Redirect to={OTHER_ROUTES[404].path()} />
          </Switch>
        </AnimatePresence>
      </MainSellerLayout>
    </>
  );
});
