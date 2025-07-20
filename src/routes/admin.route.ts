import { PREFIX_ADMIN_ROUTE } from '~/constants';

import type { AdminRouteKeys, RouteType } from '~/types';

import { AvatarBadgePage, ButtonsPage, CheckboxRadioSwitchPage, DialogPage, DropdownPopoverPage, InputsPage, SelectsPage, TabPage, TooltipPage } from '~/pages/admin/components/';

export const ADMIN_ROUTES: {
  [key in AdminRouteKeys]: RouteType;
} = {
  components: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components`,
    permission: null
  },
  buttons: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/buttons`,
    permission: null,
    Element: ButtonsPage
  },
  inputs: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/inputs`,
    permission: null,
    Element: InputsPage
  },
  selects: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/selects`,
    permission: null,
    Element: SelectsPage
  },
  checkboxRadioSwitch: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/checkbox-radio-and-switch`,
    permission: null,
    Element: CheckboxRadioSwitchPage
  },
  dialog: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/dialog`,
    permission: null,
    Element: DialogPage
  },
  tooltip: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/tooltip`,
    permission: null,
    Element: TooltipPage
  },
  dropdownPopover: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/dropdown-and-popover`,
    permission: null,
    Element: DropdownPopoverPage
  },
  avatarBadge: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/avatar-and-badge`,
    permission: null,
    Element: AvatarBadgePage
  },
  tab: {
    path: (): string => `${PREFIX_ADMIN_ROUTE}/components/tab`,
    permission: null,
    Element: TabPage
  }
};
