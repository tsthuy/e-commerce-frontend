import { memo } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import type { ProductPaginationParams } from '~/types';

import { useProductList, useTranslation } from '~/hooks';

import { Container, Helmet, SpinnerSquare } from '~/components/common';
import { ProductCard } from '~/components/product';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '~/components/ui/pagination';

import { PUBLIC_ROUTES } from '~/routes';

import { mapToSimpleProducts } from '~/utils/product.util';

export const BestSellingPage = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const pageSize = 8; // 8 items per page (2 rows x 4 items)

  const queryParams: ProductPaginationParams = {
    page: currentPage,
    size: pageSize,
    sortBy: 'soldCount',
    sortDirection: 'desc'
  };

  const { data, isLoading, isError } = useProductList({
    data: queryParams,
    enabled: true
  });

  const handlePageChange = (newPage: number): void => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    history.push(`${location.pathname}?${params.toString()}`);
  };

  const products = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  if (isLoading) {
    return (
      <Helmet titleEntire={t('BestSelling.title')}>
        <Container className="py-8">
          <div className="flex h-64 items-center justify-center">
            <SpinnerSquare />
          </div>
        </Container>
      </Helmet>
    );
  }

  if (isError) {
    return (
      <Helmet titleEntire={t('BestSelling.title')}>
        <Container className="py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">{t('BestSelling.failedToLoad')}</p>
            </div>
          </div>
        </Container>
      </Helmet>
    );
  }

  const simpleProducts = mapToSimpleProducts(products);

  return (
    <Helmet titleEntire={t('BestSelling.title')}>
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-full max-w-[calc(1280px+4px*4*2)] px-4 py-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="h-[40px] w-[20px] rounded bg-primary"></div>
                <h1 className="text-2xl font-bold uppercase text-primary">{t('BestSelling.title')}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Products Count */}
        {totalElements > 0 && (
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500">
              {t('BestSelling.showingResults', {
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
              <p className="text-gray-500">{t('BestSelling.noProducts')}</p>
            </div>
          </div>
        )}
      </Container>
    </Helmet>
  );
});
