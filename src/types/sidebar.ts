import type { ReactNode } from 'react';

import type { PERMISSIONS } from '~/constants';

import type { IconSvgType } from './common';

export type SidebarItemType = {
  groupLabel?: string;
  menu: Array<{
    href: string;
    label: ReactNode;
    icon?: IconSvgType;
    permission: Array<(typeof PERMISSIONS)[keyof typeof PERMISSIONS]> | null;
    subMenu?: Array<{
      href: string;
      label: ReactNode;
      permission: Array<(typeof PERMISSIONS)[keyof typeof PERMISSIONS]> | null;
    }>;
  }>;
  isHidden?: boolean;
};
