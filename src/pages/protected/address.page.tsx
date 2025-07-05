import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Helmet } from '~/components/common';
import { ProfileAddress } from '~/components/pages/protected/profile';

export const AddressPage = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={t('Customer.addresses')}>
      <ProfileAddress />
    </Helmet>
  );
});
