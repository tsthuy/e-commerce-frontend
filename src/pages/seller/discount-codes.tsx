import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const DiscountCodes = memo(() => {
  return (
    <Helmet title="Discount Codes">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Discount Codes</h1>
        <p>Discount code management will appear here</p>
      </Container>
    </Helmet>
  );
});
