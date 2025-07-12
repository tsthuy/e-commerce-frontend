import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Helmet } from '~/components/common';
import { SellerSettingsContent } from '~/components/pages/seller/settings/seller-settings-content';

export const SellerSettings = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={t('Seller.settings')}>
      <SellerSettingsContent />
    </Helmet>
  );
});
