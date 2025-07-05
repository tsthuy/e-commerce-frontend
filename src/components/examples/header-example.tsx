import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { LanguageSwitcher } from '~/components/common';

export const HeaderExample = memo(() => {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{t('Common.welcome')}</h1>
        </div>

        <nav className="flex items-center gap-4">
          <a className="text-sm font-medium hover:text-primary" href="/">
            {t('Navigation.home')}
          </a>
          <a className="text-sm font-medium hover:text-primary" href="/products">
            {t('Navigation.products')}
          </a>
          <a className="text-sm font-medium hover:text-primary" href="/orders">
            {t('Navigation.orders')}
          </a>
          <a className="text-sm font-medium hover:text-primary" href="/account">
            {t('Navigation.account')}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
});

HeaderExample.displayName = 'HeaderExample';

export default HeaderExample;
