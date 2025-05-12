import { memo } from 'react';

import { Container } from '~/components/common';

export const HomePage = memo(() => {
  return (
    <Container isFitScreen isFullWidth className="border bg-white shadow-md">
      <h1>Hello Here is source base</h1>
    </Container>
  );
});
