import type { ReactNode } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const PaymentForm = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

  const options = {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800;900&display=swap'
      }
    ]
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  );
};
