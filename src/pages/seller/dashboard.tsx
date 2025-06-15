import { memo } from 'react';

import { BadgeDollarSign, Calendar, LayoutGrid, MessageCircle, Package, PlusCircle, RefreshCcw, Settings, ShoppingBag, Tag } from 'lucide-react';

import { Container, Helmet } from '~/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui';

const sellerTabs = [
  {
    name: 'Dashboard',
    value: 'dashboard',
    icon: LayoutGrid
  },
  {
    name: 'All Orders',
    value: 'all_orders',
    icon: Package
  },
  {
    name: 'All Products',
    value: 'all_products',
    icon: ShoppingBag
  },
  {
    name: 'Create Product',
    value: 'create_product',
    icon: PlusCircle
  },
  {
    name: 'All Events',
    value: 'all_events',
    icon: Calendar
  },
  {
    name: 'Create Event',
    value: 'create_event',
    icon: PlusCircle
  },
  {
    name: 'Withdraw Money',
    value: 'withdraw_money',
    icon: BadgeDollarSign
  },
  {
    name: 'Shop Inbox',
    value: 'shop_inbox',
    icon: MessageCircle
  },
  {
    name: 'Discount Codes',
    value: 'discount_codes',
    icon: Tag
  },
  {
    name: 'Refunds',
    value: 'refunds',
    icon: RefreshCcw
  },
  {
    name: 'Settings',
    value: 'settings',
    icon: Settings
  }
];

export const Dashboard = memo(() => {
  return (
    <Helmet title="Seller Dashboard">
      <Container isFitScreen className="px-2 py-8">
        <Tabs className="flex w-full items-start gap-4" defaultValue={sellerTabs[0].value} orientation="vertical">
          <TabsList className="grid h-full shrink-0 grid-cols-1 gap-3 bg-background p-0">
            {sellerTabs.map((tab) => (
              <TabsTrigger key={tab.value} className="justify-start px-3 py-2 text-lg hover:bg-black/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" value={tab.value}>
                <tab.icon className="me-2 size-6" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mb-10 flex h-full w-full flex-col justify-start rounded-md border">
            <TabsContent className="mt-0 w-full p-8" value="dashboard">
              <h1 className="mb-6 text-2xl font-bold">Dashboard Overview</h1>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <DashboardCard title="Total Sales" value="$24,560" />
                <DashboardCard title="Total Orders" value="345" />
                <DashboardCard title="Total Products" value="132" />
              </div>
              {/* Add more dashboard content here */}
            </TabsContent>

            <TabsContent className="mt-0 w-full p-8" value="all_orders">
              <h1 className="mb-6 text-2xl font-bold">All Orders</h1>
              <p>Order management will appear here</p>
            </TabsContent>

            <TabsContent className="mt-0 w-full p-8" value="all_products">
              <h1 className="mb-6 text-2xl font-bold">All Products</h1>
              <p>Product list will appear here</p>
            </TabsContent>

            {/* Add TabsContent for other tabs as needed */}
          </div>
        </Tabs>
      </Container>
    </Helmet>
  );
});

// Simple card component for dashboard metrics
const DashboardCard = memo(({ title, value }: { title: string; value: string }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
});
