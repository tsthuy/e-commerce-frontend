import { memo } from 'react';

import type { CartResponse } from '~/types';

interface OrderSummaryProps {
  cart: CartResponse;
}

export const OrderSummary = memo(({ cart }: OrderSummaryProps): JSX.Element => {
  return <div></div>;
});
