import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { profileQueries } from './profile.query';

import { cartQueries } from '~/queries/cart.query';
import { categoryQueries } from '~/queries/category.query';
import { wishlistQueries } from '~/queries/wishlist.query';

export const queries = mergeQueryKeys(profileQueries, categoryQueries, cartQueries, wishlistQueries);
