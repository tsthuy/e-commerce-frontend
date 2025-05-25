import { memo } from 'react';

import { BookUser, LockKeyhole, LogOut, MessageCircleMore, Package, TicketSlash, TramFront, User } from 'lucide-react';

import { Container, Helmet } from '~/components/common';
import { ProfileContent } from '~/components/pages/protected/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui';

const tabs = [
  {
    name: 'Profile',
    value: 'profile',
    icon: User
  },
  {
    name: 'Orders',
    value: 'package',
    icon: Package
  },
  {
    name: 'Refunds',
    value: 'refund',
    icon: TicketSlash
  },
  {
    name: 'Message',
    value: 'messages',
    icon: MessageCircleMore
  },
  {
    name: 'Track Orders',
    value: 'track_order',
    icon: TramFront
  },
  {
    name: 'Change Password',
    value: 'change_password',
    icon: LockKeyhole
  },
  {
    name: 'Addresses',
    value: 'address',
    icon: BookUser
  },

  {
    name: 'Logout',
    value: 'logout',
    icon: LogOut
  }
];

export const ProfilePage = memo(() => {
  return (
    <Helmet title="Profile">
      <Container isFitScreen className="pt-8">
        <Tabs className="flex w-full items-start gap-4" defaultValue={tabs[0].value} orientation="vertical">
          <TabsList className="grid h-full shrink-0 grid-cols-1 gap-3 bg-background p-0">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} className="justify-start px-3 py-2 text-lg hover:bg-black/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" value={tab.value}>
                <tab.icon className="me-2 size-6" /> {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mb-10 flex h-full w-full flex-col justify-start rounded-md border">
            <TabsContent className="mt-0 w-full" value="profile">
              <ProfileContent />
            </TabsContent>
          </div>
        </Tabs>
      </Container>
    </Helmet>
  );
});
