import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { profileQueries } from './profile.query';

export const queries = mergeQueryKeys(profileQueries);
