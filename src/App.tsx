import { Route, Switch } from 'react-router-dom';

import { PREFIX_ADMIN_ROUTE, PREFIX_AUTH_ROUTE, PREFIX_PROTECTED_ROUTE, PREFIX_PUBLIC_ROUTE, PREFIX_SELLER_ROUTE } from '~/constants';

import { AdminLayout, AuthLayout, ProtectedLayout, PublicLayout, SellerLayout } from '~/layouts';

import { AdminLoginPage } from '~/pages/admin/admin-login.page';

import { AdminAuthLayout } from '~/layouts/admin-auth.layout';

function App(): React.JSX.Element {
  return (
    <Switch>
      <Route exact path="/admin/login">
        <AdminLoginPage />
      </Route>
      <Route path="/admin">
        <AdminAuthLayout />
      </Route>
      <Route path={PREFIX_AUTH_ROUTE}>
        <AuthLayout />
      </Route>
      <Route path={PREFIX_PROTECTED_ROUTE}>
        <ProtectedLayout />
      </Route>
      {import.meta.env.VITE_ENV.includes('local') && (
        <Route path={PREFIX_ADMIN_ROUTE}>
          <AdminLayout />
        </Route>
      )}
      <Route path={PREFIX_SELLER_ROUTE}>
        <SellerLayout />
      </Route>
      <Route path={PREFIX_PUBLIC_ROUTE}>
        <PublicLayout />
      </Route>
    </Switch>
  );
}

export default App;
