import { memo } from 'react';

import { KeyRound, MapPin, MessageCircle, Package, RefreshCcw, Truck, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '~/libs';

const sidebarItems = [
  {
    name: 'Profile',
    route: '/user/profile',
    icon: User
  },
  {
    name: 'My Orders',
    route: '/user/orders',
    icon: Package
  },
  {
    name: 'Track Orders',
    route: '/user/tracks',
    icon: Truck
  },
  {
    name: 'Refunds',
    route: '/user/refunds',
    icon: RefreshCcw
  },
  {
    name: 'Messages',
    route: '/user/message',
    icon: MessageCircle
  },
  {
    name: 'Change Password',
    route: '/user/change-password',
    icon: KeyRound
  },
  {
    name: 'Address',
    route: '/user/address',
    icon: MapPin
  }
];

export const CustomerSidebar = memo(() => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-[var(--header-public)] z-20 flex h-[calc(100vh-var(--header-public))] w-64 flex-col border-r bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">My Account</h2>
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
