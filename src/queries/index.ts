import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { profileQueries } from './profile.query';

import { adminCustomerQueries } from '~/queries/admin-customer.query';
import { adminSellerQueries } from '~/queries/admin-seller.query';
import { adminQueries } from '~/queries/admin.query';
import { cartQueries } from '~/queries/cart.query';
import { categoryQueries } from '~/queries/category.query';
import { chatQueries } from '~/queries/chat.queries';
import { dashboardQueries } from '~/queries/dashboard.query';
import { orderQueries } from '~/queries/order.query';
import { productQueries } from '~/queries/product.query';
import { reviewQueries } from '~/queries/review.query';
import { sellerQueries } from '~/queries/seller.query';
import { userInfoQueries } from '~/queries/user-info.query';
import { wishlistQueries } from '~/queries/wishlist.query';

export const queries = mergeQueryKeys(
  profileQueries,
  categoryQueries,
  chatQueries,
  dashboardQueries,
  cartQueries,
  wishlistQueries,
  orderQueries,
  sellerQueries,
  reviewQueries,
  userInfoQueries,
  adminQueries,
  adminCustomerQueries,
  adminSellerQueries,
  productQueries
);
