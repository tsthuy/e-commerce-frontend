import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Container, Helmet } from '~/components/common';

export const WithdrawMoney = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={t('Seller.withdrawMoney')}>
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('Seller.withdrawMoney')}</h1>
        <p>{t('Seller.withdrawMoneyDesc')}</p>
      </Container>
    </Helmet>
  );
});
