import { memo } from 'react';

import { AnimatePresence } from 'framer-motion';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { FooterAdminLayout } from '~/components/layouts/admin/footer';
import { HeaderAdminLayout } from '~/components/layouts/admin/header/index';
import { SidebarAdminLayout } from '~/components/layouts/admin/sidebar/index';

import { ADMIN_ROUTES, OTHER_ROUTES } from '~/routes';

export const AdminLayout = memo(() => {
  const location = useLocation();

  return (
    <>
      <SidebarAdminLayout />
      <HeaderAdminLayout />
      <AnimatePresence mode="wait">
        <Switch key={location.pathname} location={location}>
          {Object.values(ADMIN_ROUTES).map(
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
      <FooterAdminLayout />
    </>
  );
});
