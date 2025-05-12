import { API_HAVE_SLASH_IN_END } from '~/constants';

import type { AnyType } from '~/types';

export function extractParamsFromUrl(template: string, url: string): AnyType {
  const pattern = template.replace(/:[^/]+/g, '([^/]+)');
  const regex = new RegExp(`^${pattern}$`);

  // @ts-ignore
  const keys = [...template.matchAll(/:([^/]+)/g)].map((match) => match[1]);

  const match = url.slice(0, url.length - (API_HAVE_SLASH_IN_END ? 1 : 0)).match(regex);
  if (!match) return null;

  const params: Record<string, string> = {};
  keys.forEach((key, index) => {
    params[key] = match[index + 1];
  });

  return params;
}
