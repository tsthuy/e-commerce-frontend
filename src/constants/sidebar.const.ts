import { ComponentIcon } from 'lucide-react';

import type { SidebarItemType } from '~/types';

import { ADMIN_ROUTES, PUBLIC_ROUTES } from '~/routes';

export const SIDEBAR_ADMIN: Array<SidebarItemType> = [
  {
    groupLabel: 'Storybook',
    menu: [
      {
        href: ADMIN_ROUTES.components.path(),
        label: 'Components',
        icon: ComponentIcon,
        permission: null,
        subMenu: [
          {
            href: ADMIN_ROUTES.buttons.path(),
            label: 'Buttons',
            permission: null
          },
          {
            href: ADMIN_ROUTES.inputs.path(),
            label: 'Input and Textarea',
            permission: null
          },
          {
            href: ADMIN_ROUTES.selects.path(),
            label: 'Select',
            permission: null
          },
          {
            href: ADMIN_ROUTES.checkboxRadioSwitch.path(),
            label: 'Checkbox, Radio and Switch',
            permission: null
          },
          {
            href: ADMIN_ROUTES.dialog.path(),
            label: 'Dialog',
            permission: null
          },
          {
            href: ADMIN_ROUTES.tooltip.path(),
            label: 'Tooltip',
            permission: null
          },
          {
            href: ADMIN_ROUTES.dropdownPopover.path(),
            label: 'Dropdown and Popover',
            permission: null
          },
          {
            href: ADMIN_ROUTES.avatarBadge.path(),
            label: 'Avatar and Badge',
            permission: null
          },
          {
            href: ADMIN_ROUTES.tab.path(),
            label: 'Tab',
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
        label: 'Home',
        permission: null
      },
      {
        href: PUBLIC_ROUTES.bestSelling.path(),
        label: 'Best Selling',
        permission: null
      },
      {
        href: PUBLIC_ROUTES.products.path(),
        label: 'Products',
        permission: null
      },
      {
        href: PUBLIC_ROUTES.events.path(),
        label: 'Events',
        permission: null
      },
      {
        href: PUBLIC_ROUTES.faq.path(),
        label: 'FAQ',
        permission: null
      }
    ]
  }
];
