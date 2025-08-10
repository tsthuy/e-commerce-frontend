import { ComponentIcon } from 'lucide-react';

import { ADMIN_ROUTES, PUBLIC_ROUTES } from '~/routes';

import type { SidebarItemType } from '~/types/sidebar';

export const SIDEBAR_ADMIN: Array<SidebarItemType> = [
  {
    groupLabel: 'Sidebar.storybook',
    menu: [
      {
        href: ADMIN_ROUTES.components.path(),
        label: 'Sidebar.components',
        icon: ComponentIcon,
        permission: null,
        subMenu: [
          {
            href: ADMIN_ROUTES.buttons.path(),
            label: 'Sidebar.buttons',
            permission: null
          },
          {
            href: ADMIN_ROUTES.inputs.path(),
            label: 'Sidebar.inputAndTextarea',
            permission: null
          },
          {
            href: ADMIN_ROUTES.selects.path(),
            label: 'Sidebar.select',
            permission: null
          },
          {
            href: ADMIN_ROUTES.checkboxRadioSwitch.path(),
            label: 'Sidebar.checkboxRadioSwitch',
            permission: null
          },
          {
            href: ADMIN_ROUTES.dialog.path(),
            label: 'Sidebar.dialog',
            permission: null
          },
          {
            href: ADMIN_ROUTES.tooltip.path(),
            label: 'Sidebar.tooltip',
            permission: null
          },
          {
            href: ADMIN_ROUTES.dropdownPopover.path(),
            label: 'Sidebar.dropdownPopover',
            permission: null
          },
          {
            href: ADMIN_ROUTES.avatarBadge.path(),
            label: 'Sidebar.avatarBadge',
            permission: null
          },
          {
            href: ADMIN_ROUTES.tab.path(),
            label: 'Sidebar.tab',
            permission: null
          }
        ]
      }
    ]
  }
];

export const SIDEBAR_PUBLIC: Array<SidebarItemType> = [
  {
    menu: [
      {
        href: PUBLIC_ROUTES.index.path(),
        label: 'Sidebar.home',
        permission: null
      },
      {
        href: PUBLIC_ROUTES.bestSelling.path(),
        label: 'Sidebar.bestSelling',
        permission: null
      },
      {
        href: PUBLIC_ROUTES.products.path(),
        label: 'Sidebar.products',
        permission: null
      },
      {
        href: PUBLIC_ROUTES.faq.path(),
        label: 'Sidebar.faq',
        permission: null
      }
    ]
  }
];
