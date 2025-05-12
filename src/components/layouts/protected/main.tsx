import type { ReactNode } from 'react';
import { memo } from 'react';

import { MainPublicLayout } from '../public';

type MainProtectedLayoutProps = {
  children: ReactNode;
};

export const MainProtectedLayout = memo(({ children }: MainProtectedLayoutProps) => {
  return <MainPublicLayout>{children}</MainPublicLayout>;
});
