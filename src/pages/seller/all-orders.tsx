import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const AllOrders = memo(() => {
  return (
    <Helmet title="All Orders">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">All Orders</h1>
        <p>Order management will appear here</p>
      </Container>
    </Helmet>
  );
});
