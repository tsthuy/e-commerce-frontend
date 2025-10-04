import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Helmet } from '~/components/common';
import { ProfileContent } from '~/components/pages/protected/profile';

export const ProfilePage = memo(() => {
  const { t } = useTranslation();

  return (
    <Helmet title={t('Customer.profile')}>
      <ProfileContent />
    </Helmet>
  );
});
