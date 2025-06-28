import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const ShopInbox = memo(() => {
  return (
    <Helmet title="Shop Inbox">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Shop Inbox</h1>
        <p>Customer messages will appear here</p>
      </Container>
    </Helmet>
  );
});
