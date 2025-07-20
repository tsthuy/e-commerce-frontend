import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { profileQueries } from './profile.query';

import { cartQueries } from '~/queries/cart.query';
import { categoryQueries } from '~/queries/category.query';
import { dashboardQueries } from '~/queries/dashboard.query';
import { orderQueries } from '~/queries/order.query';
import { reviewQueries } from '~/queries/review.query';
import { sellerQueries } from '~/queries/seller.query';
import { userInfoQueries } from '~/queries/user-info.query';
import { wishlistQueries } from '~/queries/wishlist.query';

export const queries = mergeQueryKeys(profileQueries, categoryQueries, dashboardQueries, cartQueries, wishlistQueries, orderQueries, sellerQueries, reviewQueries, userInfoQueries);
