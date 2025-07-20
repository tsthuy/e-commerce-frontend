import { memo } from 'react';

import { AnimatePresence } from 'framer-motion';
import { Route, Switch, useLocation } from 'react-router-dom';

import { AdminAuthHeader, AdminAuthMainLayout, AdminAuthSideBar } from '~/components/layouts/admin/admin-auth';

import { ADMIN_AUTH_ROUTES } from '~/routes/admin-auth.route';

export const AdminAuthLayout = memo(() => {
  const location = useLocation();

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
