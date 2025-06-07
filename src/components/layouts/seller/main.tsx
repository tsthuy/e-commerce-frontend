import type { ReactNode } from 'react';
import { memo } from 'react';

import { MainPublicLayout } from '~/components/layouts/public';

type MainSellerLayoutProps = {
  children: ReactNode;
};

export const MainSellerLayout = memo(({ children }: MainSellerLayoutProps) => {
  return <MainPublicLayout>{children}</MainPublicLayout>;
});
