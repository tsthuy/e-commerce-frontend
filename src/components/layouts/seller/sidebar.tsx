import { memo } from 'react';

import { BadgeDollarSign, Calendar, FolderOpen, LayoutGrid, MessageCircle, Package, PlusCircle, RefreshCcw, Settings, ShoppingBag, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '~/libs';

import { SELLER_ROUTES } from '~/routes';

const sidebarItems = [
  {
    name: 'Dashboard',
    route: SELLER_ROUTES.dashboard.path(),
    icon: LayoutGrid
  },
  {
    name: 'All Orders',
    route: SELLER_ROUTES.allOrders.path(),
    icon: Package
  },
  {
    name: 'All Products',
    route: SELLER_ROUTES.allProducts.path(),
    icon: ShoppingBag
  },
  {
    name: 'Create Product',
    route: SELLER_ROUTES.createProduct.path(),
    icon: PlusCircle
  },
  {
    name: 'All Events',
    route: SELLER_ROUTES.allEvents.path(),
    icon: Calendar
  },
  {
    name: 'Create Event',
    route: SELLER_ROUTES.createEvent.path(),
    icon: PlusCircle
  },
  {
    name: 'Withdraw Money',
    route: SELLER_ROUTES.withdrawMoney.path(),
    icon: BadgeDollarSign
  },
  {
    name: 'Shop Inbox',
    route: SELLER_ROUTES.shopInbox.path(),
    icon: MessageCircle
  },
  {
    name: 'Discount Codes',
    route: SELLER_ROUTES.discountCodes.path(),
    icon: Tag
  },
  {
    name: 'Refunds',
    route: SELLER_ROUTES.refunds.path(),
    icon: RefreshCcw
  },
  {
    name: 'Categories',
    route: SELLER_ROUTES.categories.path(),
    icon: FolderOpen
  },
  {
    name: 'Settings',
    route: SELLER_ROUTES.settings.path(),
    icon: Settings
  }
];

export const SellerSideBar = memo(() => {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Seller Dashboard</h2>
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
