import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { profileQueries } from './profile.query';

import { categoryQueries } from '~/queries/category.query';

export const queries = mergeQueryKeys(profileQueries, categoryQueries);
