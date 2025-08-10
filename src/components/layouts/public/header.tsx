import { memo, useEffect, useMemo, useState } from 'react';

import { ChevronDown, ChevronRight, Menu, Package } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';
import { z } from 'zod';

import { DEFAULT_IMG_PLACEHOLDER } from '~/constants';

import type { CategoryResponse } from '~/types';

import { useCategoryList, useDebounce, useTranslation } from '~/hooks';

import { hasRole, isAuthenticated } from '~/utils';

import { Button } from '~/components/common';
import { CustomForm, CustomInputSearch } from '~/components/form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui';

import { AUTH_ROUTES, PUBLIC_ROUTES, SELLER_ROUTES } from '~/routes';

export const HeaderPublicLayout = memo(() => {
  const { t } = useTranslation();
  const history = useHistory();
  const { data: categoryData } = useCategoryList({
    data: { size: 10, page: 0 },
    enabled: true
  });

  const categories = categoryData?.result?.content || [];

  const handleCategoryClick = (category: CategoryResponse): void => {
    const params = new URLSearchParams();
    params.set('categoryId', category.id.toString());
    params.set('categoryName', category.name);
    params.set('page', '0');
    history.push(`${PUBLIC_ROUTES.products.path()}?${params.toString()}`);
  };

  return (
    <header className="h-header-public bg-primary">
      <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] items-center justify-between gap-x-10 px-4">
        <div className="flex flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex min-w-64 justify-between rounded-md bg-white px-2 py-2">
              <Menu />
              {t('Navigation.allCategories')} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-64">
              <DropdownMenuSeparator />
              {categories.map((category: CategoryResponse) => (
                <DropdownMenuItem key={category.id} className="flex cursor-pointer items-center gap-3 p-3" onClick={() => handleCategoryClick(category)}>
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
                    {category.imageUrl ? (
                      <img
                        alt={category.name}
                        className="h-full w-full object-cover"
                        src={category.imageUrl}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_IMG_PLACEHOLDER;
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden flex-grow items-center gap-x-6 md:flex">
          <SearchBar />
        </div>
        <div className="flex flex-shrink-0 items-center justify-end gap-x-5">
          <Link to={isAuthenticated() && hasRole('SELLER') ? `${SELLER_ROUTES.dashboard.path()}` : `${AUTH_ROUTES.sellerSignup.path()}`}>
            <Button className="min-w-[120px]" color="primary" size="sm" variant="default">
              {isAuthenticated() && hasRole('SELLER') ? t('Navigation.dashboard') : t('Navigation.becomeSeller')} <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
});

export const SearchBar = memo(() => {
  const { t } = useTranslation();
  const schema = useMemo(() => z.object({ searchTerm: z.string().optional() }), []);
  const history = useHistory();

  const defaultValues = useMemo(() => ({ searchTerm: '' }), []);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const handleSearch = async (value: string): Promise<void> => {
      const params = new URLSearchParams();
      params.set('search', value);
      params.set('page', '0');
      history.push(`${PUBLIC_ROUTES.products.path()}?${params.toString()}`);
    };

    if (debouncedSearchTerm !== '') {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, history]);

  return (
    <CustomForm className="w-full" options={{ defaultValues }} schema={schema}>
      <CustomInputSearch className="w-full" handleOnChange={(e) => setSearchTerm(e.target.value)} name="searchTerm" placeholder={t('Navigation.searchProducts')} />
    </CustomForm>
  );
});
