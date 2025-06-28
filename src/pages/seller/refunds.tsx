import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const Refunds = memo(() => {
  return (
    <Helmet title="Refunds">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Refunds</h1>
        <p>Refund management will appear here</p>
      </Container>
    </Helmet>
  );
});
