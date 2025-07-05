import { memo } from 'react';

import { useHistory } from 'react-router-dom';

import type { ProductResponse } from '~/types';

import { useTranslation } from '~/hooks';

import { Container, Helmet } from '~/components/common';
import { ProductsTable } from '~/components/pages/seller/product';

import { SELLER_ROUTES } from '~/routes';

export const AllProducts = memo(() => {
  const { t } = useTranslation();
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
    <Helmet title={t('Seller.allProducts')}>
      <Container className="px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t('Seller.allProducts')}</h1>
          <p className="text-muted-foreground">{t('Seller.manageInventory')}</p>
        </div>

        {/* Products Table with all features */}
        <ProductsTable onCreate={handleCreate} onEdit={handleEdit} onView={handleView} />
      </Container>
    </Helmet>
  );
});
