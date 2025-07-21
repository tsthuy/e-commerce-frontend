import { memo } from 'react';

import { useHistory } from 'react-router-dom';

import { SEO_AUTHOR } from '~/constants';

import type { ProductResponse } from '~/types';

import { Helmet } from '~/components/common';
import { AdminProductsTable } from '~/components/pages/admin/product/admin-products-table';

export const AdminAllProductsPage = memo(() => {
  const history = useHistory();

  const handleViewProduct = (product: ProductResponse): void => {
    history.push(`/admin/product-view/${product.id}`);
  };

  return (
    <Helmet title={`All Products - Admin - ${SEO_AUTHOR}`}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and monitor all products in the system</p>
        </div>

        <AdminProductsTable onView={handleViewProduct} />
      </div>
    </Helmet>
  );
});
