import { memo } from 'react';

import { useHistory } from 'react-router-dom';

import type { ProductResponse } from '~/types';

import { Container, Helmet } from '~/components/common';
import { ProductsTable } from '~/components/pages/seller/product';

import { SELLER_ROUTES } from '~/routes';

export const AllProducts = memo(() => {
  const history = useHistory();

  const handleCreate = (): void => {
    history.push(SELLER_ROUTES.createProduct.path());
  };

  const handleEdit = (product: ProductResponse): void => {
    history.push(SELLER_ROUTES.editProduct.path(product.id));
  };

  const handleView = (product: ProductResponse): void => {
    history.push(SELLER_ROUTES.productView.path(product.id));
  };

  return (
    <Helmet title="All Products">
      <Container className="px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

        {/* Products Table with all features */}
        <ProductsTable onCreate={handleCreate} onEdit={handleEdit} onView={handleView} />
      </Container>
    </Helmet>
  );
});
