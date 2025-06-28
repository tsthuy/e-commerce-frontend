import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const SellerSettings = memo(() => {
  return (
    <Helmet title="Settings">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        <p>Shop settings will appear here</p>
      </Container>
    </Helmet>
  );
});
