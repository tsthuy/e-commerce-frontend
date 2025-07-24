import { memo } from 'react';

import { Boxes, LayoutGrid, Package, ShoppingBag, User, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '~/libs';

import { ADMIN_AUTH_ROUTES } from '~/routes/admin-auth.route';

const sidebarItems = [
  {
    name: 'Dashboard',
    route: ADMIN_AUTH_ROUTES.dashboard.path(),
    icon: LayoutGrid
  },
  {
    name: 'Categories',
    route: ADMIN_AUTH_ROUTES.categories.path(),
    icon: Boxes
  },
  {
    name: 'All Products',
    route: ADMIN_AUTH_ROUTES.allProducts.path(),
    icon: ShoppingBag
  },
  {
    name: 'All Orders',
    route: ADMIN_AUTH_ROUTES.allOrders.path(),
    icon: Package
  },
  {
    name: 'All Customers',
    route: ADMIN_AUTH_ROUTES.allCustomers.path(),
    icon: User
  },
  {
    name: 'All Sellers',
    route: ADMIN_AUTH_ROUTES.allSellers.path(),
    icon: Users
  }
];

export const AdminAuthSideBar = memo(() => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-[var(--header-public)] z-20 flex h-[calc(100vh-var(--header-public))] w-64 flex-col border-r bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.route;

          return (
            <Link
              key={item.route}
              to={item.route}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'
              )}
            >
              <Icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
});
