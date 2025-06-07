import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import Cookie from 'js-cookie';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';

import { COOKIE_KEYS, PREFIX_SELLER_ROUTE } from '~/constants';

import { CardCustom } from '~/components/common';
import { CardContent } from '~/components/ui';

import { AUTH_ROUTES, OTHER_ROUTES, PUBLIC_ROUTES } from '~/routes';

import { SELLER_ROUTES } from '~/routes/seller.route';

export const AuthLayout = memo(() => {
  const location = useLocation();
  const { push } = useHistory();

  const { pathname } = location;
  const loggedStatus = !!Cookie.get(COOKIE_KEYS.accessToken) && !!Cookie.get(COOKIE_KEYS.refreshToken);

  const redirectPath: string = useMemo(() => (pathname.includes(PREFIX_SELLER_ROUTE) ? SELLER_ROUTES.dashboard.path() : PUBLIC_ROUTES.index.path()), [pathname]);
  const ignoreRedirect: Array<string> = useMemo(() => [], []);

  if (loggedStatus && !ignoreRedirect.includes(pathname)) {
    push(redirectPath);
    return null;
  }

  return (
    <div className="relative mx-auto flex min-h-svh max-w-screen-xl items-center justify-center gap-x-20 p-6 md:p-10">
      <div className="w-full">
        <div className="flex flex-col gap-6">
          <CardCustom>
            <CardContent className="grid p-0">
              <AnimatePresence mode="wait">
                <Switch key={location.pathname} location={location}>
                  {Object.values(AUTH_ROUTES).map(
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
            </CardContent>
          </CardCustom>
        </div>
      </div>
    </div>
  );
});

export const AuthLayoutContent = memo(({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      animate="visible"
      className="p-6"
      exit="hidden"
      initial="hidden"
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
      }}
    >
      {children}
    </motion.div>
  );
});
