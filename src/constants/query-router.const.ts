export type ParamsKeys = (typeof QUERY_ROUTER)[keyof typeof QUERY_ROUTER];

export const QUERY_ROUTER = {
  callbackUrl: 'callbackUrl',
  productId: 'productId'
} as const;
