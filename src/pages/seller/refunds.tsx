import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Container, Helmet } from '~/components/common';

export const Refunds = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={t('Seller.refunds')}>
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('Seller.refunds')}</h1>
        <p>{t('Seller.refundsDesc')}</p>
      </Container>
    </Helmet>
  );
});
