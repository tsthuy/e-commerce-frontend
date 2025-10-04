import { memo } from 'react';

import { useHistory } from 'react-router-dom';

import { SEO_AUTHOR } from '~/constants';

import type { ProductResponse } from '~/types';

import { useTranslation } from '~/hooks';

import { Helmet } from '~/components/common';
import { AdminProductsTable } from '~/components/pages/admin/product/admin-products-table';

export const AdminAllProductsPage = memo(() => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleViewProduct = (product: ProductResponse): void => {
    history.push(`/admin/product-view/${product.id}`);
  };

  return (
    <Helmet title={`${t('Admin.products.allProductsTitle')} - Admin - ${SEO_AUTHOR}`}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Admin.products.allProductsTitle')}</h1>
          <p className="mt-1 text-sm text-gray-600">{t('Admin.products.allProductsSubtitle')}</p>
        </div>

        <AdminProductsTable onView={handleViewProduct} />
      </div>
    </Helmet>
  );
});
