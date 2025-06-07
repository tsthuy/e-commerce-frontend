import { memo } from 'react';

import { AnimatePresence } from 'framer-motion';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { TopHeaderPublicLayout } from '~/components/layouts/public';
import { MainSellerLayout } from '~/components/layouts/seller/main';

import { OTHER_ROUTES, SELLER_ROUTES } from '~/routes';

export const SellerLayout = memo(() => {
  const location = useLocation();
  console.log('hehe');

  return (
    <>
      <TopHeaderPublicLayout />
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
