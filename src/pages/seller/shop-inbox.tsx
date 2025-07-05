import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Container, Helmet } from '~/components/common';

export const ShopInbox = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={t('Seller.shopInbox')}>
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('Seller.shopInbox')}</h1>
        <p>{t('Seller.shopInboxDesc')}</p>
      </Container>
    </Helmet>
  );
});
