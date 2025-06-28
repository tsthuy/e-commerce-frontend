import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const CreateEvent = memo(() => {
  return (
    <Helmet title="Create Event">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Create Event</h1>
        <p>Event creation form will appear here</p>
      </Container>
    </Helmet>
  );
});
