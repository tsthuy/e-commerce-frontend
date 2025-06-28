import { memo } from 'react';

import { Container, Helmet } from '~/components/common';

export const WithdrawMoney = memo(() => {
  return (
    <Helmet title="Withdraw Money">
      <Container className="px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Withdraw Money</h1>
        <p>Money withdrawal interface will appear here</p>
      </Container>
    </Helmet>
  );
});
