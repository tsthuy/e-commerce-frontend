import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';

import { DEFAULT_ADMIN_AVATAR } from '~/constants';

import type { ProductResponse } from '~/types';

import { useAdminProductList, useDataTable, useTranslation } from '~/hooks';

import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/common/table';
import { Button } from '~/components/ui';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/components/ui/alert-dialog';

import { useDeleteAdminProduct } from '~/hooks/use-admin-management.hook';

interface AdminProductsTableProps {
  onView?: (product: ProductResponse) => void;
}

export const AdminProductsTable = memo<AdminProductsTableProps>(({ onView }) => {
  const { t } = useTranslation();
  const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteProductMutation = useDeleteAdminProduct();

  const handleDeleteClick = (product: ProductResponse): void => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (productToDelete) {
      try {
        await deleteProductMutation.mutateAsync(productToDelete.id);
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const columns: ColumnDef<ProductResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.products.productName')} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="">
              <img alt={row.getValue('name')} className="h-14 min-w-14 rounded-md border object-cover" src={row.original.defaultImageUrl || DEFAULT_ADMIN_AVATAR} />
            </div>
            <div className="">
              <div className="font-medium">{row.getValue('name')}</div>
              {row.original.sku && (
                <div className="text-sm text-muted-foreground">
                  {t('Admin.products.sku')}: {row.original.sku}
                </div>
              )}
            </div>
          </div>
        ),
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'categoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.products.category')} />,
        cell: ({ row }) => <div className="text-sm">{row.getValue('categoryName') || '-'}</div>,
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'seller',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.products.seller')} />,
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="font-medium">{row.original.sellerName || 'N/A'}</div>
          </div>
        ),
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'price',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.products.price')} />,
        cell: ({ row }): JSX.Element => {
          const price = row.getValue('price') as number;
          const salePrice = row.original.salePrice;
          return (
            <div className="text-sm">
              {salePrice ? (
                <>
                  <span className="font-medium text-red-600">${salePrice}</span>
                  <span className="ml-1 text-gray-500 line-through">${price}</span>
                </>
              ) : (
                <span className="font-medium">${price}</span>
              )}
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'stock',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.products.stock')} />,
        cell: ({ row }): JSX.Element => {
          const stock = row.getValue('stock') as number;
          return <div className={`text-sm ${stock <= 0 ? 'text-red-600' : stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{stock}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.products.status')} />,
        cell: ({ row }): JSX.Element => {
          const status = row.getValue('status') as string;
          const isPublished = row.original.isPublished;
          return (
            <div className="flex flex-col">
              <span
                className={`w-fit rounded-full px-2 py-1 text-xs ${
                  status === 'ACTIVE' ? 'bg-green-100 text-green-800' : status === 'INACTIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {status}
              </span>
              {isPublished && <span className="mt-1 text-xs text-blue-600">{t('Admin.products.published')}</span>}
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.products.created')} />,
        cell: ({ row }): JSX.Element => {
          const date = new Date(row.getValue('createdAt'));
          return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: t('Admin.products.actions'),
        cell: ({ row }): JSX.Element => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onView?.(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button className="text-red-600 hover:text-red-700" size="sm" variant="outline" onClick={() => handleDeleteClick(row.original)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ],
    [onView, t]
  );
  const filterFields = useMemo(
    () => [
      {
        label: t('Admin.products.searchProducts'),
        value: 'name' as keyof ProductResponse,
        placeholder: t('Admin.products.searchByNameOrSku')
      }
    ],
    [t]
  );
  const { table } = useDataTable({
    data: [],
    columns,
    pageCount: 0,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] }
    }
  });
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;

  const queryParamsFromTable = useMemo(() => {
    const searchFilter = columnFilters.find((filter) => filter.id === 'name');
    const sortConfig = sorting[0];

    const params: Record<string, string | number> = {
      page: pagination.pageIndex,
      size: pagination.pageSize
    };

    if (sortConfig) {
      params.sortBy = sortConfig.id;
      params.sortDirection = sortConfig.desc ? 'desc' : 'asc';
    }

    if (searchFilter?.value) {
      params.search = String(searchFilter.value);
    }

    return params;
  }, [pagination, sorting, columnFilters]);

  const { data: productsResponse, isLoading } = useAdminProductList({
    data: queryParamsFromTable
  });

  const products = productsResponse?.content || [];
  const pageCount = productsResponse?.totalPages || 0;

  table.options.data = products;
  table.options.pageCount = pageCount;

  return (
    <div className="space-y-4">
      <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground" isLoading={isLoading} table={table}>
        <DataTableToolbar filterFields={filterFields} table={table} />
      </DataTable>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Admin.products.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Admin.products.deleteConfirmDescription')} <strong>{productToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProductMutation.isPending} onClick={handleDeleteCancel}>
              {t('Admin.products.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteProductMutation.isPending} onClick={handleDeleteConfirm}>
              {deleteProductMutation.isPending ? t('Admin.products.deleting') : t('Admin.products.deleteProduct')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

AdminProductsTable.displayName = 'AdminProductsTable';
