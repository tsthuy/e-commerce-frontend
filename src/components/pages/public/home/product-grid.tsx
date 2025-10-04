import { memo } from 'react';

import { useProductList, useRecommendProductForCustomer, useTranslation } from '~/hooks';

import { SpinnerSquare } from '~/components/common';
import { ProductCard } from '~/components/product';

import { PUBLIC_ROUTES } from '~/routes';

import { useProfile } from '~/hooks/use-profile.hook';
import { mapToSimpleProducts } from '~/utils/product.util';

export const ProductGrid = memo(() => {
  const { t } = useTranslation();
  const { data: profile } = useProfile({ enabled: true });
  const shouldUseRecommendations = !!profile?.id;

  const {
    data: recommendedData,
    isLoading: isRecommendationsLoading,
    isError: isRecommendationsError
  } = useRecommendProductForCustomer({
    page: 0,
    size: 8,
    enabled: shouldUseRecommendations
  });

  const {
    data: regularData,
    isLoading: isRegularLoading,
    isError: isRegularError
  } = useProductList({
    data: {
      page: 0,
      size: 8,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    },
    enabled: !shouldUseRecommendations
  });

  const data = shouldUseRecommendations ? recommendedData : regularData;
  const isLoading = shouldUseRecommendations ? isRecommendationsLoading : isRegularLoading;
  const isError = shouldUseRecommendations ? isRecommendationsError : isRegularError;

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
        <p className="text-gray-500">{t('Home.failedToLoadProducts')}</p>
      </div>
    );
  }

  const simpleProducts = mapToSimpleProducts(data.content);

  return (
    <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] px-4">
      {shouldUseRecommendations && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('Home.recommendedForYou')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('Home.recommendedDescription')}</p>
        </div>
      )}

      <div className="flex w-full flex-wrap gap-[30px]">
        {simpleProducts.map((product) => (
          <div key={product.id} className="sm:w-[calc((100%-30px)/2)] md:w-[calc((100%-60px)/3)] lg:w-[calc((100%-90px)/4)]">
            <ProductCard linkTo={PUBLIC_ROUTES.productDetail.path(product.id)} product={product} />
          </div>
        ))}
      </div>
    </div>
  );
});
