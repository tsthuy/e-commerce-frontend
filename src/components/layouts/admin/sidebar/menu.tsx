import type { ReactNode } from 'react';
import { memo, useMemo, useState } from 'react';

import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, DotIcon, EllipsisIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { SIDEBAR_ADMIN } from '~/constants';

import type { IconSvgType } from '~/types';

import { cn } from '~/libs';

import { useSidebarStore } from '~/stores';

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui';

export const Menu = memo(({ isOpen }: { isOpen: boolean }) => {
  const { pathname } = useLocation();

  const profilePermissions = useMemo(() => [], []);

  return (
    <ScrollArea className="flex-grow [&>div>div[style]]:!block [&>div>div]:h-full">
      <nav className="size-full">
        <ul className="flex min-h-full flex-col items-start space-y-1 px-2">
          {SIDEBAR_ADMIN.filter((item) => !!!item.isHidden).map(({ groupLabel, menu }, index) => (
            <li key={index} className={cn('w-full', { 'pt-5': !!groupLabel })}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">{groupLabel}</p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <EllipsisIcon className="size-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
              {menu
                .filter(({ permission }) => {
                  if (permission === null) return true;

                  const allExist = profilePermissions === undefined || permission.every((item) => profilePermissions.includes(item));

                  return allExist;
                })
                .map(({ href, label, icon: Icon, subMenu }, index) =>
                  !!subMenu && subMenu.length > 0 ? (
                    <div key={index} className="w-full">
                      <CollapseMenuButton
                        href={href}
                        icon={Icon}
                        label={label}
                        subMenu={subMenu.filter(({ permission }) => {
                          if (permission === null) return true;

                          const allExist = profilePermissions === undefined || permission.every((item) => profilePermissions.includes(item));

                          return allExist;
                        })}
                      />
                    </div>
                  ) : (
                    <div key={index} className="w-full">
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button
                              asChild
                              variant={pathname === href ? 'secondary' : 'ghost'}
                              className={cn('mb-1 h-10 w-full justify-start font-normal text-muted-foreground hover:text-foreground', {
                                'pointer-events-none relative font-medium text-foreground': pathname.includes(href),
                                "after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:rounded-bl-md after:rounded-tl-md after:bg-primary after:content-['']": pathname.includes(href)
                              })}
                            >
                              <Link to={href}>
                                <span className={cn(isOpen === false ? '' : 'mr-4')}>{Icon && <Icon className="size-5" />}</span>
                                <p className={cn('max-w-[200px] truncate', isOpen === false ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100')}>{label}</p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && <TooltipContent side="right">{label}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )
                )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
});

const CollapseMenuButton = memo(
  ({
    icon: Icon,
    label,
    href,
    subMenu
  }: {
    icon?: IconSvgType;
    label: ReactNode;
    href: string;
    subMenu: Array<{
      href: string;
      label: ReactNode;
    }>;
  }) => {
    const { pathname } = useLocation();
    const { isOpen } = useSidebarStore();

    const isSubmenuActive = useMemo(() => subMenu.some((item) => pathname === item.href), [pathname]);

    const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

    return (
      subMenu.length > 0 && (
        <>
          {isOpen ? (
            <Collapsible className="w-full" open={isCollapsed} onOpenChange={setIsCollapsed}>
              <CollapsibleTrigger asChild className="mb-1 [&[data-state=open]>div>div>svg]:rotate-180">
                <Button
                  variant={pathname.includes(href) ? 'secondary' : 'ghost'}
                  className={cn('h-10 w-full justify-start font-normal text-muted-foreground hover:text-foreground', {
                    'font-medium text-foreground': pathname.includes(href)
                  })}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-4">{Icon && <Icon className="size-5" />}</span>
                      <p
                        className={cn('max-w-[150px] truncate', {
                          'translate-x-0 opacity-100': isOpen,
                          '-translate-x-96 opacity-0': !isOpen
                        })}
                      >
                        {label}
                      </p>
                    </div>
                    <div
                      className={cn('whitespace-nowrap', {
                        'translate-x-0 opacity-100': isOpen,
                        '-translate-x-96 opacity-0': !isOpen
                      })}
                    >
                      <ChevronDownIcon className="transition-transform duration-200" size={18} />
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                {subMenu.map(({ href, label }, index) => (
                  <Button
                    key={index}
                    asChild
                    variant={pathname === href ? 'secondary' : 'ghost'}
                    className={cn('mb-1 h-10 w-full justify-start font-normal text-muted-foreground hover:text-foreground', {
                      'relative font-medium text-foreground': pathname === href,
                      "after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:rounded-bl-md after:rounded-tl-md after:bg-primary after:content-['']": pathname === href
                    })}
                  >
                    <Link to={href}>
                      <span className="ml-2 mr-4">
                        <DotIcon size={18} />
                      </span>
                      <p
                        className={cn('max-w-[170px] truncate', {
                          'translate-x-0 opacity-100': isOpen,
                          '-translate-x-96 opacity-0': !isOpen
                        })}
                      >
                        {label}
                      </p>
                    </Link>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <DropdownMenu>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button className="mb-1 h-10 w-full justify-start" variant={pathname.includes(href) ? 'secondary' : 'ghost'}>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <span
                              className={cn({
                                'mr-4': isOpen
                              })}
                            >
                              {Icon && <Icon className="size-5" />}
                            </span>
                            <p
                              className={cn('max-w-[200px] truncate', {
                                'opacity-0': !isOpen,
                                'opacity-100': isOpen
                              })}
                            >
                              {label}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent align="start" alignOffset={2} side="right">
                    {label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="start" side="right" sideOffset={25}>
                <DropdownMenuLabel className="max-w-[190px] truncate">{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {subMenu.map(({ href, label }, index) => (
                  <DropdownMenuItem key={index} asChild className="mb-1">
                    <Link
                      to={href}
                      className={cn('cursor-pointer', {
                        'bg-secondary': pathname === href
                      })}
                    >
                      <p className="max-w-[180px] truncate">{label}</p>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuArrow className="fill-border" />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )
    );
  }
);
