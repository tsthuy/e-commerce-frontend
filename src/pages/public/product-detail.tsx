import { memo } from 'react';

import { useParams } from 'react-router-dom';

import { useProductDetail } from '~/hooks';

import { Container, Helmet, SpinnerSquare } from '~/components/common';
import { ProductDetailContent } from '~/components/pages/public/product-detail';

export const ProductDetailPage = memo(() => {
  const { productId } = useParams<{ productId: string }>();

  const {
    data: product,
    isLoading,
    isError
  } = useProductDetail({
    productId: productId!,
    enabled: !!productId
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SpinnerSquare />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
          <p className="mt-2 text-gray-600">The product you are looking for does not exist.</p>
        </div>
      </Container>
    );
  }

  return (
    <Helmet title={product.name}>
      <Container className="py-8">
        <ProductDetailContent product={product} />
      </Container>
    </Helmet>
  );
});
