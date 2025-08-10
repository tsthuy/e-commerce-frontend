import type React from 'react';
import { memo, useState } from 'react';

import { Calendar, MessageCircle, Package, Search, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { DEFAULT_IMG_SAMPLE } from '~/constants';

import type { Category, ProductResponse } from '~/types';

import { useProfile } from '~/hooks';

import { SpinnerSquare } from '~/components/common';
import { ProductCard } from '~/components/product/product-card';
import { Button, Input } from '~/components/ui';

import { PUBLIC_ROUTES } from '~/routes';

import { useCategoryList } from '~/hooks/use-category.hook';
import { usePublicSellerProducts } from '~/hooks/use-public-seller-products';
import { usePublicSellerProfile } from '~/hooks/use-public-seller-profile';

export const SellerPreviewPage = memo(() => {
  const { t } = useTranslation(['translation', 'common']);
  const { sellerId } = useParams<{ sellerId: string }>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { push } = useHistory();

  const { data: customerResponse } = useProfile({ enabled: true });

  const {
    data: sellerResponse,
    isLoading: isLoadingSeller,
    error: sellerError
  } = usePublicSellerProfile({
    sellerId: sellerId!
  });
  const { data: categoriesResponse } = useCategoryList({ data: {} });

  const { data: productsResponse, isLoading: isLoadingProducts } = usePublicSellerProducts({
    sellerId: sellerId!,
    data: {
      page: currentPage,
      size: 12,
      search: searchTerm,
      categoryId: selectedCategoryId
    }
  });

  if (isLoadingSeller) {
    return (
      <div className="flex h-96 items-center justify-center">
        <SpinnerSquare />
      </div>
    );
  }

  if (sellerError || !sellerResponse?.result) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">{t('common:not_found')}</h2>
        <p className="text-gray-600">{t('Seller not found')}</p>
      </div>
    );
  }

  const seller = sellerResponse.result;
  const categories = categoriesResponse?.result?.content ?? [];
  const products = productsResponse?.result?.content ?? [];
  const totalPages = productsResponse?.result?.totalPages ?? 0;

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleCategoryChange = (categoryId: string): void => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatWithSeller = (): void => {
    if (customerResponse?.id && sellerId) {
      const conversationId = `${customerResponse.id}_${sellerId}`;
      push(`/user/messages/conversation/${conversationId}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] px-4 py-8">
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="flex-shrink-0">
            <img alt={seller.shopName} className="h-20 w-20 rounded-full border-4 border-primary/20 object-cover md:h-24 md:w-24" src={seller.shopAvatar?.url || DEFAULT_IMG_SAMPLE} />
          </div>

          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">{seller.shopName}</h1>

            {seller.description && <p className="mb-3 leading-relaxed text-gray-600">{seller.description}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {seller.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t('translation.Joined')}{' '}
                    {new Date(seller.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{seller.averageRating ? seller.averageRating.toFixed(1) : '-'}</span>
                <span className="text-gray-500">
                  ({seller.reviewCount || 0} {''}
                  {t('translation.Reviews')})
                </span>
              </div>
            </div>
          </div>

          {customerResponse && (
            <div className="flex-shrink-0">
              <Button className="flex items-center gap-2" onClick={handleChatWithSeller}>
                <MessageCircle className="h-4 w-4" />
                {t('translation.Chat with seller')}
              </Button>
            </div>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold text-gray-800">{seller.totalProducts || 0}</div>
            <div className="text-sm text-gray-600">{t('Sidebar.products')}</div>
          </div>

          <div className="text-center">
            <div className="mb-2 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="text-xl font-bold text-gray-800">{seller.averageRating ? seller.averageRating.toFixed(1) : '-'}</div>
            <div className="text-sm text-gray-600">{t('translation.Rating')}</div>
          </div>

          <div className="col-span-2 text-center md:col-span-1">
            <div className="mb-2 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold text-gray-800">{seller.createdAt ? new Date(seller.createdAt).getFullYear() : '-'}</div>
            <div className="text-sm text-gray-600">{t('translation.Year Joined')}</div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Input className="w-full pl-10" placeholder={t('Navigation.searchProducts')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">{t('Admin.categories')}</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button className="whitespace-nowrap" type="submit">
                {t('Common.search')}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">{t('Sidebar.Products')}</h2>

        {isLoadingProducts ? (
          <div className="flex h-64 items-center justify-center">
            <SpinnerSquare />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product: ProductResponse) => (
                <ProductCard
                  key={product.id}
                  linkTo={PUBLIC_ROUTES.productDetail.path(product.id)}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    salePrice: product.salePrice,
                    defaultImageUrl: product.defaultImageUrl,
                    averageRating: product.averageRating,
                    reviewCount: product.reviewCount,
                    soldCount: product.soldCount,
                    categoryName: product.categoryName,
                    sellerName: product.sellerName,
                    status: product.status,
                    isNew: product.isNew
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button key={i} size="sm" variant={currentPage === i ? 'default' : 'outline'} onClick={() => handlePageChange(i)}>
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-600">{t('No products found')}</p>
          </div>
        )}
      </div>
    </div>
  );
});

SellerPreviewPage.displayName = 'SellerPreviewPage';
