import { memo } from 'react';

import { Helmet } from '~/components/common';
import { ProfileContent } from '~/components/pages/protected/profile';

export const ProfilePage = memo(() => {
  return (
    <Helmet title="Profile">
      <ProfileContent />
    </Helmet>
  );
});
