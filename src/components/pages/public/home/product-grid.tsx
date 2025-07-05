import { memo } from 'react';

import { useProductList } from '~/hooks';

import { SpinnerSquare } from '~/components/common';
import { ProductCard } from '~/components/product';

import { PUBLIC_ROUTES } from '~/routes';

import { mapToSimpleProducts } from '~/utils/product.util';

export const ProductGrid = memo(() => {
  const { data, isLoading, isError } = useProductList({
    data: {
      page: 0,
      size: 8,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <SpinnerSquare />
      </div>
    );
  }

  if (isError || !data?.content) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Failed to load products</p>
      </div>
    );
  }

  const simpleProducts = mapToSimpleProducts(data.content);

  return (
    <div className="mx-auto flex w-full max-w-[calc(1280px+4px*4*2)] flex-wrap gap-[30px] px-4">
      {simpleProducts.map((product) => (
        <div key={product.id} className="sm:w-[calc((100%-30px)/2)] md:w-[calc((100%-60px)/3)] lg:w-[calc((100%-90px)/4)]">
          <ProductCard linkTo={PUBLIC_ROUTES.productDetail.path(product.id)} product={product} />
        </div>
      ))}
    </div>
  );
});
