import { memo } from 'react';

import { Helmet } from '~/components/common';
import { ProfileAddress } from '~/components/pages/protected/profile';

export const AddressPage = memo(() => {
  return (
    <Helmet>
      <ProfileAddress />
    </Helmet>
  );
});
