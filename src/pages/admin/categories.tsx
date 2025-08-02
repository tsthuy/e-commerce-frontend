import { memo, useCallback, useState } from 'react';

import type { CategoryResponse } from '~/types';

import { useTranslation } from '~/hooks';

import { Helmet } from '~/components/common';
import { CategoriesTable, CategoryForm } from '~/components/pages/seller/category';

export const Categories = memo(() => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

  const handleCreate = useCallback(() => {
    setEditingCategory(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((category: CategoryResponse) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingCategory(null);
  }, []);

  return (
    <Helmet title={t('Admin.categories')}>
      <div className="border p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('Admin.categories')}</h1>
          <p className="text-muted-foreground">{t('Admin.manageCategories')}</p>
        </div>

        {/* Categories Table with all features */}
        <CategoriesTable onCreate={handleCreate} onEdit={handleEdit} />

        {/* Category Form Modal */}
        <CategoryForm category={editingCategory} isOpen={isFormOpen} onClose={handleCloseForm} />
      </div>
    </Helmet>
  );
});
