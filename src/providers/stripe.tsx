import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { ReactNode } from 'react';

const stripePromise = loadStripe('pk_test_51PJWgSRrmG8ADze7c73aqxkoqur4A17yXd3Akxv8dfAj79Ono2NRpPFdJyDgF3gjD0H0R1lo0QqLrGS7hu8Oj1G900L6IIQJqI');

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider = ({ children }: StripeProviderProps) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}; 