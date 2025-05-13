import { memo, useMemo } from 'react';

import { AnimatePresence } from 'framer-motion';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { FooterPublicLayout, HeaderPublicLayout, MainPublicLayout, TopHeaderPublicLayout, WrapperPublicLayout } from '~/components/layouts/public';

import { OTHER_ROUTES, PUBLIC_ROUTES } from '~/routes';

export const PublicLayout = memo(() => {
  const location = useLocation();

  const isHiddenHeader = useMemo(() => [OTHER_ROUTES[404].path()].includes(location.pathname), [location]);
  const isHiddenFooter = useMemo(() => [OTHER_ROUTES[404].path()].includes(location.pathname), [location]);

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
