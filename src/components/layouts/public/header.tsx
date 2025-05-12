import { memo } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { LOGO, SEO_AUTHOR, SIDEBAR_PUBLIC } from '~/constants';

import { cn } from '~/libs';

import { Button } from '~/components/common';

import { PUBLIC_ROUTES } from '~/routes';

export const HeaderPublicLayout = memo(() => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-10 h-header-public w-full bg-white py-2">
      <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] items-center justify-between gap-x-6 px-4">
        <Link className="flex flex-shrink-0 transition-opacity hover:opacity-85" to={PUBLIC_ROUTES.index.path()}>
          <img alt={SEO_AUTHOR} className="h-[75px] w-auto" src={LOGO} />
        </Link>
        <ul className="flex flex-shrink-0 items-center gap-x-6">
          {SIDEBAR_PUBLIC.map(({ menu }, index1) =>
            menu.map(({ label, href }, index2) => (
              <li key={`${index1}-${index2}`}>
                <Link
                  to={href}
                  className={cn('block text-base transition-all hover:text-primary hover:opacity-85', {
                    '!text-primary underline underline-offset-4': href === PUBLIC_ROUTES.index.path() ? pathname === href : pathname.includes(href)
                  })}
                >
                  {label}
                </Link>
              </li>
            ))
          )}
        </ul>
        {/* <div className="flex-grow"></div> */}
        <div className="flex flex-shrink-0 items-center justify-end gap-x-5">
          <Button roundedCustom className="min-w-[120px]" color="white" size="sm" variant="secondary">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
});
