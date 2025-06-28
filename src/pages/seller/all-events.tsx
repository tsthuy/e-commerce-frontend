import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const AllEvents = memo(() => {
  return (
    <Helmet title="All Events">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">All Events</h1>
        <p>Event management will appear here</p>
      </Container>
    </Helmet>
  );
});
