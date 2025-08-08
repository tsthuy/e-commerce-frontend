import { memo } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import type { ProductPaginationParams } from '~/types';

import { useProductList, useProductSemanticSearchDebounced, useTranslation } from '~/hooks';

import { Container, Helmet, SpinnerSquare } from '~/components/common';
import { ProductCard } from '~/components/product';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '~/components/ui/pagination';

import { PUBLIC_ROUTES } from '~/routes';

import { mapToSimpleProducts } from '~/utils/product.util';

export const ProductsPage = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const categoryId = searchParams.get('categoryId') || undefined;
  const categoryName = searchParams.get('categoryName') || undefined;
  const searchQuery = searchParams.get('search') || undefined;
  const pageSize = 8; // 8 items per page (2 rows x 4 items)

  const queryParams: ProductPaginationParams = {
    page: currentPage,
    size: pageSize,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    search: searchQuery,
    ...(categoryId && { categoryId })
  };

  // Use semantic search if search query is present, otherwise use regular product list
  const regularProductQuery = useProductList({
    data: queryParams,
    enabled: !searchQuery // Only enabled when no search query
  });

  const semanticSearchQuery = useProductSemanticSearchDebounced({
    query: searchQuery || '',
    page: currentPage,
    size: pageSize,
    enabled: !!searchQuery // Only enabled when search query exists
  });

  // Choose the appropriate query result
  const { data, isLoading, isError } = searchQuery ? semanticSearchQuery : regularProductQuery;
  const isDebouncing = searchQuery ? semanticSearchQuery.isDebouncing : false;

  const handlePageChange = (newPage: number): void => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    history.push(`${location.pathname}?${params.toString()}`);
  };

  const products = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  // Determine page title
  const getPageTitle = (): string => {
    if (searchQuery) {
      return `${t('Product.searchResults')} "${searchQuery}"`;
    }
    if (categoryName) {
      return `${categoryName} - ${t('Product.products')}`;
    }
    return t('Product.allProducts');
  };

  // Determine page heading
  const getPageHeading = (): string => {
    if (searchQuery) {
      return `${t('Product.searchResults')}: "${searchQuery}"`;
    }
    if (categoryName) {
      return `${categoryName} ${t('Product.products')}`;
    }
    return t('Product.allProducts');
  };

  if (isLoading || isDebouncing) {
    return (
      <Helmet titleEntire={getPageTitle()}>
        <Container className="py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <SpinnerSquare />
              {isDebouncing && <p className="mt-2 text-sm text-gray-500">Đang tìm kiếm bằng AI...</p>}
            </div>
          </div>
        </Container>
      </Helmet>
    );
  }

  if (isError) {
    return (
      <Helmet titleEntire={getPageTitle()}>
        <Container className="py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">{t('Product.failedToLoad')}</p>
            </div>
          </div>
        </Container>
      </Helmet>
    );
  }

  const simpleProducts = mapToSimpleProducts(products);

  return (
    <Helmet titleEntire={getPageTitle()}>
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] px-4 py-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="h-[40px] w-[20px] rounded bg-primary"></div>
                <h1 className="text-2xl font-bold uppercase text-primary">{getPageHeading()}</h1>
              </div>
            </div>
            {searchQuery && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <span>{t('Product.semanticSearchActive')}</span>
                </div>
              </div>
            )}
          </div>
          {categoryName && !searchQuery && <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">{t('Product.categorySubtitle', { category: categoryName })}</p>}
          {searchQuery && <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">{t('Product.searchSubtitle', { query: searchQuery })}</p>}
        </div>

        {/* Products Count */}
        {totalElements > 0 && (
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500">
              {t('Product.showingResults', {
                current: Math.min((currentPage + 1) * pageSize, totalElements),
                total: totalElements
              })}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {simpleProducts.length > 0 ? (
          <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] px-4">
            {/* Grid with exactly 8 items (2 rows x 4 columns) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
              {simpleProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard linkTo={PUBLIC_ROUTES.productDetail.path(product.id)} product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={currentPage <= 0 ? 'pointer-events-none opacity-50' : ''}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 0) {
                            handlePageChange(currentPage - 1);
                          }
                        }}
                      />
                    </PaginationItem>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i;

                      // Calculate which pages to show
                      if (totalPages > 5) {
                        if (currentPage <= 2) {
                          pageNum = i;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNum}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                          >
                            {pageNum + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {/* Ellipsis if needed */}
                    {totalPages > 5 && currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages - 1) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">{categoryName ? t('Product.noCategoryProducts', { category: categoryName }) : t('Product.noProducts')}</p>
            </div>
          </div>
        )}
      </Container>
    </Helmet>
  );
});
