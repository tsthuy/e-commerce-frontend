import { memo } from 'react';

import { Package } from 'lucide-react';
import { useHistory } from 'react-router-dom';

import { DEFAULT_IMG_PLACEHOLDER } from '~/constants';

import type { CategoryResponse } from '~/types';

import { useCategoryList } from '~/hooks';

import { PUBLIC_ROUTES } from '~/routes';

export const Categories = memo(() => {
  const history = useHistory();
  const { data: categoryData, isLoading } = useCategoryList({
    data: { size: 8, page: 0 },
    enabled: true
  });

  const handleCategoryClick = (category: CategoryResponse): void => {
    const params = new URLSearchParams();
    params.set('categoryId', category.id.toString());
    params.set('categoryName', category.name);
    params.set('page', '0');
    history.push(`${PUBLIC_ROUTES.products.path()}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white py-8">
        <div className="mx-auto max-w-[calc(1280px+4px*4*2)] px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="group flex flex-col items-center rounded-lg border p-4">
                <div className="mb-3 h-40 w-full animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = categoryData?.result?.content || [];

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-[calc(1280px+4px*4*2)] px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {categories.map((category: CategoryResponse) => (
            <div key={category.id} className="group flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-all hover:shadow-md" onClick={() => handleCategoryClick(category)}>
              <div className="mb-3 h-40 w-full overflow-hidden rounded-md bg-gray-50">
                {category.imageUrl ? (
                  <img
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={category.imageUrl}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMG_PLACEHOLDER;
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-center text-lg font-medium capitalize text-gray-800">{category.name}</h3>
              {category.description && <p className="mt-1 text-center text-sm text-gray-600">{category.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
